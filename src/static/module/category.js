import { Field } from "./field.js";

/**
 * @typedef CategoryData
 * @property {String} label Loca key
 * @property {import("./field.js").FieldData[]} fields
 */

/**
 * CATEGORY
 */
export class Category
{
  /**
   * @private
   * @type {String}
   */
  _label = "LABEL";
  
  /**
   * @private
   * @type {Field[]}
   */
  _fields = [];


  /**
   * Creates and initialises a category object.
   * @param {CategoryData} obj 
   * @returns {Category}
   */
  static fromObject(obj)
  {
    const c = new Category();
    c._label = obj.label;
    obj.fields.forEach(el => c._fields.push(Field.fromObject(el)));

    return c;
  }

  /**
   * @property {String} label
   */
  get label() { return this._label; }

  /**
   * @property {Field[]} fields
   */
  get fields() { return this._fields; }
}
