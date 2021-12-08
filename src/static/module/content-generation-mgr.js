import { Creation } from "./creation.js";
import { GeneratorWindow } from "./generator-window.js";
import { Recipe } from "./recipe.js";

export class ContentGenerationManager
{
  static _recipes = new Map();
  static _gen_funcs = new Map();
  static _post_proc_funcs = new Map();
  static _form_action_funcs = new Map();
  
  static init()
  {
    ContentGenerationManager._gen_funcs.set("faker", ContentGenerationManager.faker_gen_func);
    ContentGenerationManager._gen_funcs.set("self", ContentGenerationManager.self_gen_func);
    ContentGenerationManager._gen_funcs.set("table", ContentGenerationManager.rolltable_gen_func);

    ContentGenerationManager._post_proc_funcs.set("tolower", ContentGenerationManager.to_lower_pp_func);
    ContentGenerationManager._post_proc_funcs.set("slugify", ContentGenerationManager.slugify_pp_func);
    ContentGenerationManager._post_proc_funcs.set("camelcase", ContentGenerationManager.camelcase_pp_func);

    ContentGenerationManager._form_action_funcs.set("export_to_je", ContentGenerationManager.export_to_je_faf);
    ContentGenerationManager._form_action_funcs.set("redo", ContentGenerationManager.redo);
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

  static async faker_gen_func(input, fields, args)
  {
    return foundry.utils.getProperty(faker, args[0])(...args.slice(1));
  }

  static async self_gen_func(input, fields, args)
  {
    return fields[args[0]];
  }

  static async rolltable_gen_func(input, fields, args)
  {
    let drawn = await game.tables.getName(args[0]).draw({displayChat: false});
    let result = drawn.results[0].data.text;
    return result;
  }

  static to_lower_pp_func(input, args)
  {
    return input.toLowerCase();
  }

  static slugify_pp_func(input, args)
  {
    return input.slugify();
  }

  static camelcase_pp_func(input, args)
  {
    return input.replace(/\s+(\w)/g, (a, b) => b.toUpperCase());
  }

  static async export_to_je_faf(data, args)
  {
    let key = "name";
    if(args)
    {
      key = args[0];
    }
    let name = data.fields[key];
    if(!name)
    {
      name = `${game.i18n.localize('RNDNPCS.MISC.NEW_UNNAMED')} (${foundry.utils.randomID(5)})`;
      console.warn(`Unable to find name field for recipe '${data.recipe.name}'.`);
    }
    
    const je = await JournalEntry.create(
    {
      name: name,
      content: data.toHtml()
    });

    // const folderName = game.settings.get(RndConf.SCOPE, RndConf.CORP_FOLDER);
    // if(folderName)
    // {
    //   let folder = game.folders.getName(folderName);
    //   if(!folder)
    //   {
    //     folder = await Folder.create({name: folderName, type:'JournalEntry'});
    //   }

    //   await je.update({id:je.id, folder: folder.id});
    // }

    je.sheet.render(true);
  }

  /**
   * Cause a reroll for a field.
   * @param {Creation} data 
   * @param {Array} args - Array with the name of the field you want to reroll at first index. Omit the whole array to reroll all.
   */
  static redo(data, args)
  {
    console.log("Redo", args);
    if(!args || !args[0])
    {
      data.setAllDirty();
      return;
    }

    data.setDirty(args[0]);
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