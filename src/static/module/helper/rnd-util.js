export class RndUtil
{
  /**
   * Receive a boolean that is based on chance.
   * @param {number} p - The percentage [0, 1] of getting true as a result.
   * @returns {boolean}
   */
  static chance(p)
  {
    return faker.datatype.float({min: 0, max: 1}) < p;
  }
}