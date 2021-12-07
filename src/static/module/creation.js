import { ContentGenerationManager as CGMgr } from "./content-generation-mgr.js";
import { RndUtil } from "./helper/rnd-util.js";
import { PostProcessOption as PPO } from "./post-proc-option.js";
import { Recipe } from "./recipe.js";

export class Creation
{
  _recipe = null;
  _fields = {};
  
  static _max_attempts = 100;

  static get MATCHING_BRACKETS_REGEX() { return /\[(?:[^\[\]]*)*\]/g; }
  static get PART_DELIMITER() { return ':'; }


  /**
   * 
   * @param {Recipe} recipe 
   */
  constructor(recipe)
  {
    if(!recipe)
    {
      throw new Error("Cannot initialise Creation without Recipe.");
    }

    this._recipe = recipe;
    recipe.fieldNames.forEach(el =>
    {
      this.trigger(el);
    });
  }

  async trigger(field)
  {
    const recipe_field = this._recipe.getField(field);
    let result = recipe_field.option;

    let emergencyBrake = Creation._max_attempts;
    let hits = result.match(Creation.MATCHING_BRACKETS_REGEX) || [];
    while((hits.length > 0) && (emergencyBrake > 0))
    {
      emergencyBrake--;

      for(let i=0, num = hits.length; i < num; ++i)
      {
        const parts = hits[i].slice(1, -1).split(Creation.PART_DELIMITER);
        const generator = CGMgr.getGenerator(parts[0]);
        const generated = await generator(result, {...this._fields}, parts.slice(1)) ?? "";
        result = result.replace(hits[i], generated);
      }

      hits = result.match(Creation.MATCHING_BRACKETS_REGEX) || [];
    }

    recipe_field.post_proc.forEach(el =>
    {
      if(el.isUsed)
      {
        const parts = el.processOptions;
        result = CGMgr.postProcess(parts[0].toLowerCase(), result, parts.splice(1));
      }
    });

    this._fields[field] = result;
    recipe_field.propagates.forEach(el => this.trigger(el));
  }

  get recipe() { return this._recipe; }
  get fields() { return this._fields; }
}