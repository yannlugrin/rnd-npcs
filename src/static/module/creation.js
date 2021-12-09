//@ts-check
import { ContentGenerationManager as CGMgr } from "./content-generation-mgr.js";
import { Field } from "./field.js";
import { RndConf } from "./helper/rnd-conf.js";
import { RndUtil } from "./helper/rnd-util.js";
import { PostProcessStep } from "./post-proc-step.js";
import { Recipe } from "./recipe.js";

export class Creation
{
  /**
   * @private
   * @type {Recipe}
   */
  _recipe = null;
  
  /**
   * @private
   * @type {Object}
   */
  _fields = {};
  
  /**
   * @private
   * @type {Set<String>}
   */
  _dirty = new Set();
  
  /**
   * @private
   * @type {Number}
   */
  static _max_attempts = 100;

  /**
   * Maximum number of attempts to resolve a formula. Emergency brake to prevent an endless loop.
   * @type {Number}
   */
  static get max_attempts() { return this._max_attempts; }
  static set max_attempts(value) { this.max_attempts = Math.max(1, RndUtil.parseIntWithDefault(0)); }

  /**
   * Regex used to find innermost [] pairs.
   * @type {RegExp}
   */
  static get MATCHING_BRACKETS_REGEX() { return /\[(?:[^\[\]]*)*\]/g; }

  /**
   * The commonly used delimiter in this module.
   * @type {String}
   * @readonly
   */
  static get PART_DELIMITER() { return ':'; }


  /**
   * The Creation class represents a current result of a rolled Recipe. It's always tied with a GeneratorWindow.
   * @param {Recipe} recipe The Recipe that this creation should be based upon.
   */
  constructor(recipe)
  {
    if(!recipe)
    {
      throw new Error("Cannot initialise Creation without Recipe.");
    }

    this._recipe = recipe;
    this.setAllDirty();
  }

  /**
   * Call this if you need to reroll all fields.
   */
  setAllDirty()
  {
    this._recipe.fieldNames.forEach(el =>
    {
      this._dirty.add(el);
    });
  }

  /**
   * Rerolls all fields that are marked dirty.
   */
  async resolveDirty()
  {
    // Sort dirty fields by order.
    const valArr = [...this._dirty.values()];
    const sorted = valArr.sort((a, b) => { return this._recipe.getField(a).order - this._recipe.getField(b).order; });

    // Resolve rerolling.
    for(let i = 0, num = sorted.length; i < num; ++i)
    {
      // It's necessary to use a regular for loop instead of the forEach method as
      // each call needs to be resolved before another can be made.
      await this.trigger(sorted[i]);
    }
    this._dirty.clear();
  }

  /**
   * Marks a field for rerolling. Will also mark all depending fields for rerolling.
   * @param {String} field - Name of the field you want to mark.
   */
  setDirty(field)
  {
    // If Field is already on the dirty list - skip.
    if(this._dirty.has(field))
    {
      return;
    }

    // Add Field to dirty list.
    this._dirty.add(field);

    // If automatic propagation is turned off - break off here.
    if(!RndConf.promote_changes)
    {
      return;
    }

    // Otherwise mark all depending Fields as dirty.
    const recipe_field = this._recipe.getField(field);
    recipe_field.propagates.forEach(el =>
    {
      this.setDirty(el);
    });
  }

  /**
   * Actual rerolling of a field. Window needs to re-render after this.
   * @param {String} field 
   */
  async trigger(field)
  {
    //Get the field...
    /** @type {Field} */
    const recipe_field = this._recipe.getField(field);

    // ...and draw a new formula.
    /** @type {String} */
    let result = recipe_field.formula;

    // Cycle over the formula until there are no more [] bracket pairs.
    // Or until you had enough attempts to assume something went wrong
    // and you need to break out.
    /** @type {Number} */
    let emergencyBrake = Creation._max_attempts;
    /** @type {String[]} */
    let hits = result.match(Creation.MATCHING_BRACKETS_REGEX) || [];
    while((hits.length > 0) && (emergencyBrake > 0))
    {
      emergencyBrake--;

      // For every [] bracket pair that was found, resolve the encased operation.
      for(let i=0, num = hits.length; i < num; ++i)
      {
        // Each hit has the form of [f:a0:a1:a2:...:an],
        // where the amount of arguments (a) can be zero or more.
        // First step is to strip the surrounding braces, then the string needs to be split by the colons.
        const parts = hits[i].slice(1, -1).split(Creation.PART_DELIMITER);

        // First part (f) is the name of the generator function. This function shall be called
        // with all current fields for reference, as well as the remaining arguments.
        const generated = await CGMgr.generate(parts[0], {...this._fields}, parts.slice(1));

        // Only thing that remains is to implement the freshly generated piece and that's one [] bracket pair done.
        result = result.replace(hits[i], generated);
      }

      // See if there are still bracket pairs.
      hits = result.match(Creation.MATCHING_BRACKETS_REGEX) || [];
    }

    // At this point all bracket pairs have been resolved. Time for post processing.
    // Go about every step one by one.
    recipe_field.post_proc.forEach(/** @type {PostProcessStep} */el =>
    {
      // See if this step should get executed.
      if(el.isUsed)
      {
        // Retrieve the name and arguments of the post processing function for this step.
        // What's returned here is an array with the identifier as first element and the
        // arguments in the remaining elements.
        const parts = el.processOption;

        // Apply post processing to the result.
        result = CGMgr.postProcess(parts[0], result, parts.splice(1));
      }
    });

    // Store result in field.
    this._fields[field] = result;
  }

  /**
   * Creates a table with the input of all visible fields.
   * @returns {String} A HTML-String.
   */
  toHtml()
  {
    let html = '<table>';
    this.recipe.fieldNames.forEach(fieldName =>
    {
      let field = this._recipe.getField(fieldName);
      if(!field.label)
      {
        // Fields without label are considered hidden, thus getting skipped.
        return;
      }
      //@ts-ignore
      html += `<tr><td>${game.i18n.localize(field.label)}</td><td>${this._fields[field.name]}</td></tr>`
    });
    html += '</table>';

    return html;
  }

  /**
   * The recipe used in this creation.
   * @type {Recipe}
   */
  get recipe() { return this._recipe; }

  /**
   * The current values stored for this creation.
   * @type {String[]}
   */
  get fields() { return this._fields; }
}