import { Creation } from "./creation.js";
import { RndUtil } from "./helper/rnd-util.js";

/**
 * @typedef {Object} PostProcessStepData
 * @property {Number} chance A number in the range [0, 1] that determines how likely this step is to occur. 0 = none, 1 = sure.
 * @property {String[]} processPool An array containing possible PostProcessingOperationDetails.
 */

/**
 * PPS
 */
export class PostProcessStep
{
  _chance = 0;
  _processPool = [];

  /**
   * Creates and initialises a PostProcessStep
   * @param {PostProcessStepData} obj 
   * @returns {PostProcessStep}
   */
  static fromObject(obj)
  {
    const ppo = new PostProcessStep();

    ppo._chance = Number(obj.chance);

    obj.processPool.forEach(el => ppo._processPool.push(el));

    return ppo;
  }

  /**
   * Random boolean whether or not this option should be used on this pass.
   * @type {Boolean}
   */
  get isUsed() { return RndUtil.chance(this._chance); }

  /**
   * First entry is the name, the remaining entries are the arguments.
   * @type {String[]}
   */
  get processOption()
  {
    //@ts-ignore
    let result = faker.random.arrayElement(this._processPool);
    return result.split(Creation.PART_DELIMITER);
  }
}
