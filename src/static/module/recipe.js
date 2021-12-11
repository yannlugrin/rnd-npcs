import { Category } from "./category.js";
import { Field } from "./field.js";
import { ActionButton } from "./action-button.js";

/**
 * @typedef {Object} RecipeData
 * @property {String} name Technical name of the recipe.
 * @property {String} label Tooltip of scene control button.
 * @property {String} icon Icon shown in scene control button.
 * @property {import("./category.js").CategoryData[]} categories
 * @property {import("./action-button.js").ActionButtonData[]} [actions]
 */

/**
 * RECIPE
 */
export class Recipe
{
  /**
   * @private
   * @type {String}
   */
  _name = "NAME";
  
  /**
   * @private
   * @type {String}
   */
  _label = "LABEL";
  
  /**
   * @private
   * @type {String}
   */
  _icon = "fas fa-question";
  
  /**
   * @private
   * @type {Category[]}
   */
  _categories = [];

  /**
   * @private
   * @type {String[]}
   */
  _fieldNames = [];
  
  /**
   * @private
   * @type {ActionButton[]}
   */
  _btns = [];

  /**
   * Creates and initialises a Recipe instance from loose data.
   * @param {RecipeData} obj Data used to create the Recipe.
   * @returns {Recipe} The finished Recipe instance.
   */
  static fromObject(obj)
  {
    const r = new Recipe();
    r._name = obj.name;
    r._label = obj.label;
    r._icon = obj.icon;
    r._categories = [];
    r._fieldNames = [];
    obj.categories.forEach(el =>
    {
      r._categories.push(Category.fromObject(el));
      el.fields.forEach(f => r._fieldNames.push(f.name));
    });
    obj.actions?.forEach(el => r._btns.push(ActionButton.fromObject(el)));

    return r;
  }

  
  /**
   * The technical name of this Recipe.
   * @type {String}
   */
  get name() { return this._name; }
  
  /**
   * Localisation key
   * @type {String}
   */
  get label() { return this._label; }
  
  /**
   * Font Awesome icon id
   * @type {String}
   */
  get icon() { return this._icon; }
  
  /**
   * All Categories of this Recipe.
   * @type {Category[]}
   */
  get categories() { return this._categories; }
  
  /**
   * Identifier for all fields of this Recipe.
   * @type {String[]}
   */
  get fieldNames() { return this._fieldNames; }
  
  /**
   * All buttons that should be rendered at the bottom of the form.
   * @type {ActionButton[]}
   */
  get buttons() { return this._btns; }
  
  /**
   * Retrieves a field by identifier.
   * @param {String} name 
   * @returns {Field|null}
   */
  getField(name)
  {
    /** @type {Field} */
    let result = null;
    
    this._categories.forEach((/** @type {Category} */ c) =>
    {
      /** @type {Field[]} */
      const found = c.fields.filter((/** @type {Field} */ f) => f.name === name);
      if(found.length > 1)
      {
        throw new Error(`Somewhere, something went terribly wrong and now there are mutliple fields with the same name and the universe will soon start folding in on itself. Triggered by ${name} in ${c.label}.`);
      }
      if(1 === found.length)
      {
        result = found[0];
        return;
      }
    });

    return result;
  }
}
