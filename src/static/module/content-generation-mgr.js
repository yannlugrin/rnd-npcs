import { Creation } from "./creation.js";
import { GeneratorWindow } from "./generator-window.js";
import { RndUtil } from "./helper/rnd-util.js";
import { Recipe } from "./recipe.js";

export class ContentGenerationManager
{
  static _recipes = new Map();
  static _gen_funcs = new Map();
  static _post_proc_funcs = new Map();
  static _form_action_funcs = new Map();
  
  static init()
  {
    ContentGenerationManager._gen_funcs.set("faker", RndUtil.faker_gm);
    ContentGenerationManager._gen_funcs.set("self", RndUtil.self_gm);
    ContentGenerationManager._gen_funcs.set("table", RndUtil.rolltable_gm);
    ContentGenerationManager._gen_funcs.set("pick_one", RndUtil.pick_one_gm);

    ContentGenerationManager._post_proc_funcs.set("tolower", RndUtil.to_lower_ppm);
    ContentGenerationManager._post_proc_funcs.set("slugify", RndUtil.slugify_ppm);
    ContentGenerationManager._post_proc_funcs.set("camelcase", RndUtil.camelcase_ppm);

    ContentGenerationManager._form_action_funcs.set("export_to_je", RndUtil.export_to_je_fam);
    ContentGenerationManager._form_action_funcs.set("redo", RndUtil.redo_fam);
  }

  /**
   * 
   * @param {Recipe} recipeData 
   */
  static add_recipe(recipeData)
  {
    const recipe = Recipe.fromObject(recipeData)
    this._recipes.set(recipe.name, recipe);
  }

  /**
   * Add a generation function that can later be used to solve field pieces.
   * @param {String} key 
   * @param {Function} func 
   */
  static addGeneratorFunction(key, func)
  {
    ContentGenerationManager._gen_funcs.add(key.toLowerCase(), func);
  }

  /**
   * Add a string post processing function that can later be used to overhaul complete fields.
   * @param {String} key 
   * @param {Function} func 
   */
  static addPostProcessingFunction(key, func)
  {
    ContentGenerationManager._post_proc_funcs.add(key.toLowerCase(), func);
  }

  /**
   * Returns a generator function.
   * @param {String} key 
   * @returns {Method} An async generator method.
   */
  static getGenerator(key)
  {
    const k = key.toLowerCase();
    if(ContentGenerationManager._gen_funcs.has(k))
    {
      return ContentGenerationManager._gen_funcs.get(k);
    }

    throw new Error(`Key '${key}' not defined.`);
  }

  /**
   * Does some manipulation on the whole input.
   * @param {String} key 
   * @param {String} input 
   * @returns {String}
   */
  static postProcess(key, input, args)
  {
    const k = key.toLowerCase();
    if(ContentGenerationManager._post_proc_funcs.has(k))
    {
      return ContentGenerationManager._post_proc_funcs.get(k)(input, args);
    }

    throw new Error(`Post-Processing function '${key}' not found.`);
  }

  static execFormAction(key, data, args)
  {
    const k = key.toLowerCase();
    if(ContentGenerationManager._form_action_funcs.has(k))
    {
      return ContentGenerationManager._form_action_funcs.get(k)(data, args);
    }

    throw new Error(`Form-action function '${key}' not found.`);
  }

  /**
   * @param {String} name Tech name of the recipe. 
   * @returns {Recipe} The recipe that was requested.
   * @throws {Error} If no Recipe with the given name was found.
   */
  static getRecipe(name)
  {
    const k = name.toLowerCase();
    if(ContentGenerationManager._recipes.has(k))
    {
      return ContentGenerationManager._recipes.get(k)(data, args);
    }

    throw new Error(`Recipe '${key}' not found.`);
  }

  static getSceneButtons()
  {
    return [...ContentGenerationManager._recipes.values()].map(el =>
    {
      return {
        icon: el.icon,
        name: el.name,
        title: game.i18n.localize(el.label),
        visible: true,
        button: true,
        onClick: () =>
        {
          new GeneratorWindow(el).render(true);
        }
      }
    })
  }
}