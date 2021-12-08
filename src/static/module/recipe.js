//@ts-check
import { Category } from "./category.js";
import { Field } from "./field.js";
import { ActionButton } from "./action-button.js";

export class Recipe
{
  _name = "NAME";
  _label = "LABEL";
  _icon = "fas fa-question";
  _categories = [];
  _fieldNames = [];
  _btns = [];

  /**
   * Creates and initialises a Recipe instance from loose data.
   * @param {Object} obj Recipedata
   * @param {String} obj.name Technical name of the recipe.
   * @param {String} obj.label
   * @param {String} obj.icon
   * @param {Array} obj.categories
   * @param {Array} obj.actions
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

  get name() { return this._name; }
  set name(value) { this._name = value; }
  get label() { return this._label; }
  set label(value) { this._label = value; }
  get icon() { return this._icon; }
  set icon(value) { this._icon = value; }
  get categories() { return this._categories; }
  get fieldNames() { return this._fieldNames; }
  get buttons() { return this._btns; }
  
  /**
   * 
   * @param {String} name 
   * @returns {Field|null}
   */
  getField(name)
  {
    let result = null;
    
    this._categories.forEach((/** @type {Category} */ c) =>
    {
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
