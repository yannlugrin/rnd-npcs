//@ts-check
import { RndUtil } from "./helper/rnd-util.js";
import { PostProcessStep } from "./post-proc-step.js";

/**
 * FIELD
 */
export class Field
{
  /**
   * @private
   */
  _name = "NAME";

  /**
   * @private
   */
  _label = "LABEL";

  /**
   * @private
   */
  _order = 0;

  /**
   * @private
   * @type {String[]}
   */
  _formula = [];

  /**
   * @private
   * @type {String[]}
   */
  _propagates = [];

  /**
   * @private
   * @type {PostProcessStep[]}
   */
  _post_proc = [];
  
  /**
   * @typedef {Object} FieldData
   * @property {String} name The technical name of the field.
   * @property {String} [label] Loca-key for this field. Omit for hidden fields.
   * @property {Number} order An integer determininig when, in relation to the other fields, this one gets rerolled. The higher the later.
   * @property {String[]} formulas All possible formulas for this Field.
   * @property {String[]} [propagates] The names of the fields that require rerolling should this one change.
   * @property {PostProcessStepData} [post_proc] All post processing steps in the desired order of execution.
   */

  /**
   * Creates and initialises a Field instance from loose data.
   * @param {FieldData} obj 
   * @returns {Field} 
   */
  static fromObject(obj)
  {
    const f = new Field();
    f._name = obj.name;
    f._label = obj.label;
    f._order = RndUtil.parseIntWithDefault(obj.order);
    obj.formulas.forEach(el => f._formula.push(el));
    obj.propagates?.forEach(el => f._propagates.push(el));
    obj.post_proc?.forEach(el => f._post_proc.push(PostProcessStep.fromObject(el)));

    return f;
  }

  /**
   * The technical name of the Field.
   * @type {String}
   * @readonly
   */
  get name() { return this._name; }

  /**
   * The technical name of the Field.
   * @type {String}
   * @readonly
   */
  get label() { return this._label; }

  /**
   * Order for resolvment. The higher, the later it gets resolved.
   * @type {Number}
   * @readonly
   */
  get order() { return this._order; }

  /**
   * The names of the fields that need rerolling if this field changes.
   * @type {String[]}
   * @readonly
   */
  get propagates() { return this._propagates; }

  /**
   * 
   * @type {PostProcessStep[]}
   * @readonly
   */
  get post_proc() { return this._post_proc; }

  /**
   * A random choice from all available formulas for this field.
   * @type {String}
   * @readonly
   */
  // @ts-ignore
  get formula() { return faker.random.arrayElement(this._formula) ?? "EMPTY"; }
}