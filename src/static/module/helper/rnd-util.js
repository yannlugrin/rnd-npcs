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

  /**
   * Tries to parse any given input into an Integer.
   * @param {*} value
   * @returns {Integer} Either the succesfully parsed Integer or 0.
   */
  static parseIntWithDefault(value)
  {
    console.log(value);
    if(typeof value === "number" && !isNaN(value))
    {
      return Math.floor(value);
    }

    const attempt = parseInt(value);
    console.log(attempt);
    if(typeof attempt === "number" && !isNaN(attempt))
    {
      return attempt;
    }

    return 0;
  }
}