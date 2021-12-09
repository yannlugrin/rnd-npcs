import { RndUtil } from "./helper/rnd-util.js";
import { PostProcessOption as PPO } from "./post-proc-option.js";

export class Field
{
  _name = "NAME";
  _label = "LABEL";
  _order = 0;
  _options = [];
  _propagates = [];
  _post_proc = [];

  static fromObject(obj)
  {
    const f = new Field();
    f._name = obj.name;
    f._label = obj.label;
    f._order = RndUtil.parseIntWithDefault(obj.order);
    obj.options.forEach(el => f._options.push(el));
    obj.propagates?.forEach(el => f._propagates.push(el));
    obj.post_proc?.forEach(el => f._post_proc.push(PPO.fromObject(el)));

    return f;
  }

  get name() { return this._name; }
  set name(value) { this._name = value; }
  get label() { return this._label; }
  set label(value) { this._label = value; }
  get order() { return this._order; }
  get propagates() { return this._propagates; }
  get post_proc() { return this._post_proc; }

  /**
   * @property {String} option - A random choice from the options.
   */
  get option() { return faker.random.arrayElement(this._options) ?? "EMPTY"; }
}