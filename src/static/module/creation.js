import { ContentGenerationManager as CGMgr } from "./content-generation-mgr.js";
import { Field } from "./field.js";
import { RndUtil } from "./helper/rnd-util.js";
import { PostProcessOption as PPO } from "./post-proc-option.js";
import { Recipe } from "./recipe.js";

export class Creation
{
  _recipe = null;
  _fields = {};
  _dirty = new Set();
  
  static _max_attempts = 100;

  static get MATCHING_BRACKETS_REGEX() { return /\[(?:[^\[\]]*)*\]/g; }
  static get PART_DELIMITER() { return ':'; }


  /**
   * 
   * @param {Recipe} recipe 
   */
  constructor(recipe)
  {
    if(!recipe)
    {
      throw new Error("Cannot initialise Creation without Recipe.");
    }

    this._recipe = recipe;
    this.setAllDirty();
    console.log(this._recipe);
  }

  setAllDirty()
  {
    this._recipe.fieldNames.forEach(el =>
    {
      this._dirty.add(el);
    });
  }

  async resolveDirty()
  {
    // Sort dirty fields by order.
    const valArr = [...this._dirty.values()];
    const sorted = valArr.sort((a, b) => { return this._recipe.getField(a).order - this._recipe.getField(b).order; });

    // Resolve rerolling.
    sorted.forEach(async el => this.trigger(el));
    this._dirty.clear();
  }

  /**
   * Marks a field for rerolling. Will also mark all depending fields for rerolling.
   * @param {String} field - Name of the field you want to mark.
   */
  setDirty(field)
  {
    if(this._dirty.has(field))
    {
      return;
    }

    this._dirty.add(field);
    const recipe_field = this._recipe.getField(field);
    recipe_field.propagates.forEach(el =>
    {
      this.setDirty(el);
    });

    console.log(this._dirty);
  }

  async trigger(field)
  {
    console.log("trigger", field);
    const recipe_field = this._recipe.getField(field);
    let result = recipe_field.option;

    let emergencyBrake = Creation._max_attempts;
    let hits = result.match(Creation.MATCHING_BRACKETS_REGEX) || [];
    while((hits.length > 0) && (emergencyBrake > 0))
    {
      emergencyBrake--;

      for(let i=0, num = hits.length; i < num; ++i)
      {
        const parts = hits[i].slice(1, -1).split(Creation.PART_DELIMITER);
        const generator = CGMgr.getGenerator(parts[0]);
        const generated = await generator(result, {...this._fields}, parts.slice(1)) ?? "";
        result = result.replace(hits[i], generated);
      }

      hits = result.match(Creation.MATCHING_BRACKETS_REGEX) || [];
    }

    recipe_field.post_proc.forEach(el =>
    {
      if(el.isUsed)
      {
        const parts = el.processOption;
        result = CGMgr.postProcess(parts[0].toLowerCase(), result, parts.splice(1));
      }
    });

    this._fields[field] = result;
    //recipe_field.propagates.forEach(el => this.trigger(el));
  }

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

      html += `<tr><td>${game.i18n.localize(field.label)}</td><td>${this._fields[field.name]}</td></tr>`
    });
    html += '</table>';

    return html;
  }

  get recipe() { return this._recipe; }
  get fields() { return this._fields; }
}