import { Creation } from "./creation.js";
import { RndUtil } from "./helper/rnd-util.js";

export class PostProcessOption
{
  _chance = 0;
  _processPool = [];

  static fromObject(obj)
  {
    const ppo = new PostProcessOption();

    ppo._chance = Number(obj.chance);

    obj.processPool.forEach(el => ppo._processPool.push(el));

    return ppo;
  }

  /**
   * @member {Boolean} isUsed - Random boolean whether or not this option should be used on this pass.
   */
  get isUsed() { return RndUtil.chance(this._chance); }

  /**
   * @member {String} processOption - First entry is the name, the remaining entries are the arguments.
   */
  get processOption()
  {
    let result = faker.random.arrayElement(this._processPool);
    return result.split(Creation.PART_DELIMITER);
  }
}
