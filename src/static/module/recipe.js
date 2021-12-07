import { Category } from "./category.js";
import { Field } from "./field.js";

export class Recipe
{
  _name = "NAME";
  _label = "LABEL";
  _icon = "fas fa-question";
  _categories = [];
  _fieldNames = [];

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
  
  /**
   * 
   * @param {String} name 
   * @returns {Field|null}
   */
  getField(name)
  {
    let result = null;
    
    this._categories.forEach(c =>
    {
      const found = c.fields.filter(f => f.name === name);
      if(found.length > 1)
      {
        throw new Error(`Somewhere, something went terribly wrong and now there are mutliple fields with the same name and the universe will soon start folding in on itself. Triggered by ${name} in ${c.name}.`);
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
