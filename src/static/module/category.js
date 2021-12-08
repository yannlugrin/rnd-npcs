import { Field } from "./field.js";

export class Category
{
  _label = "LABEL";
  _fields = [];

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
   * @property {Array<Field>} fields
   */
  get fields() { return this._fields; }
}
