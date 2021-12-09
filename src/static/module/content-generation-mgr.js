import { GeneratorWindow } from "./generator-window.js";
import { Recipe } from "./recipe.js";

/**
 * Responsible for managing content creation functionality.
 */
export class ContentGenerationManager
{
  /**
   * A function that is used to resolve a bit of a formula.
   * @callback ContentGenerationManager~GeneratorFunction
   * @param {Array<String>} fields The current value of all fields.
   * @param {Array<*>} args Arguments to call the generator with.
   */

  /**@private */ static _recipes = new Map();
  /**@private */ static _gen_funcs = new Map();
  /**@private */ static _post_proc_funcs = new Map();
  /**@private */ static _form_action_funcs = new Map();

  static get REGISTER_GENERATOR_FUNCTIONS_HOOK() { return 'registerGeneratorFunctions'; }
  static get REGISTER_POST_PROCESSING_FUNCTIONS_HOOK() { return 'registerPostProcessingFunctions'; }
  static get REGISTER_FORM_ACTION_FUNCTIONS_HOOK() { return 'registerFormActionFunctions'; }
  static get REGISTER_RECIPES_HOOK() { return 'registerRecipes'; }
  
  static init()
  {
    Hooks.callAll(ContentGenerationManager.REGISTER_GENERATOR_FUNCTIONS_HOOK, ContentGenerationManager._add_generator_function);
    Hooks.callAll(ContentGenerationManager.REGISTER_POST_PROCESSING_FUNCTIONS_HOOK, ContentGenerationManager._add_post_processing_function);
    Hooks.callAll(ContentGenerationManager.REGISTER_FORM_ACTION_FUNCTIONS_HOOK, ContentGenerationManager._add_form_action_function);
    Hooks.callAll(ContentGenerationManager.REGISTER_RECIPES_HOOK, ContentGenerationManager._add_recipe);
  }

  /**
   * Add a recipe that can be used in a generator window.
   * @param {Object} recipeData
   * @private
   */
  static _add_recipe(recipeData)
  {
    const recipe = Recipe.fromObject(recipeData)
    ContentGenerationManager._recipes.set(recipe.name, recipe);
  }

  /**
   * Add a generation function that can later be used to solve field pieces.
   * @param {String} key
   * @param {GeneratorFunction} func
   * @private
   */
  static _add_generator_function(key, func)
  {
    ContentGenerationManager._gen_funcs.set(key.toLowerCase(), func);
  }

  /**
   * Add a string post processing function that can later be used to overhaul complete fields.
   * @param {String} key 
   * @param {Function} func 
   * @private
   */
  static _add_post_processing_function(key, func)
  {
    ContentGenerationManager._post_proc_funcs.set(key.toLowerCase(), func);
  }

  /**
   * Add a function that can later be called from a button at the bottom of the form.
   * @param {String} key 
   * @param {Function} func 
   * @private
   */
  static _add_form_action_function(key, func)
  {
    console.log("register", key);
    ContentGenerationManager._form_action_funcs.set(key.toLowerCase(), func);
  }

  /**
   * Returns a String that has been generated from a specific generator function.
   * @param {String} key Identifier for the generator function.
   * @param {Array<String>} fields The current value of all fields.
   * @param {Array<*>} args Arguments to call the generator with.
   * @returns {String} The generated result.
   */
  static async generate(key, fields, args)
  {
    const k = key.toLowerCase();
    if(ContentGenerationManager._gen_funcs.has(k))
    {
      return await ContentGenerationManager._gen_funcs.get(k)(fields, args);
    }

    throw new Error(`Generation function '${key}' not registered.`);
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

    throw new Error(`Post-Processing function '${key}' not registered.`);
  }

  /**
   * Executes a registered Form Action Function.
   * @param {String} key Identifier of the function you want to call.
   * @param {Object} data Holds all the latest rolled results.
   * @param {Array<*>} args Arguments to pass.
   */
  static execFormAction(key, data, args)
  {
    const k = key.toLowerCase();

    if(ContentGenerationManager._form_action_funcs.has(k))
    {
      const func = ContentGenerationManager._form_action_funcs.get(k)(data, args);
      return;
    }

    throw new Error(`Form-action function '${key}' not registered.`);
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