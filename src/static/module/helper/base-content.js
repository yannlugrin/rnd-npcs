import { ContentGenerationManager as CGMgr } from "../content-generation-mgr.js";

/**
 * This class holds, and is responsible for, the most basal content.
 * It's also a good place to look up how stuff works when it comes to
 * registering custom content.
 */
export class BaseContentManager
{
  static init()
  {
    Hooks.once(CGMgr.REGISTER_GENERATOR_FUNCTIONS_HOOK, (register) =>
    {
      register("faker", BaseContentManager.faker_gm);
      register("self", BaseContentManager.self_gm);
      register("table", BaseContentManager.rolltable_gm);
      register("pick_one", BaseContentManager.pick_one_gm);
    });

    Hooks.once(CGMgr.REGISTER_POST_PROCESSING_FUNCTIONS_HOOK, (register) =>
    {
      register("slugify", BaseContentManager.slugify_ppm);
      register("tolower", BaseContentManager.to_lower_ppm);
      register("camelcase", BaseContentManager.camelcase_ppm);
    });

    Hooks.once(CGMgr.REGISTER_FORM_ACTION_FUNCTIONS_HOOK, (register) =>
    {
      register("redo", BaseContentManager.redo_fam);
      register("export_to_je", BaseContentManager.export_to_je_fam);
    });
  }

  //---------------------------------------------------------------
  // Generator Methods
  //---------------------------------------------------------------
  static async faker_gm(fields, args)
  {
    return foundry.utils.getProperty(faker, args[0])(...args.slice(1));
  }

  static async self_gm(fields, args)
  {
    return fields[args[0]];
  }

  static async rolltable_gm(fields, args)
  {
    let drawn = await game.tables.getName(args[0]).draw({displayChat: false});
    let result = drawn.results[0].data.text;
    return result;
  }

  static async pick_one_gm(input, args)
  {
    console.log("pick", args);
    return faker.random.arrayElement(args);
  }

  //---------------------------------------------------------------
  // Postprocessing Methods
  //---------------------------------------------------------------
  static to_lower_ppm(input, args)
  {
    return input.toLowerCase();
  }

  static slugify_ppm(input, args)
  {
    return input.slugify();
  }

  static camelcase_ppm(input, args)
  {
    return input.replace(/\s+(\w)/g, (a, b) => b.toUpperCase());
  }

  //---------------------------------------------------------------
  // Form Action Methods
  //---------------------------------------------------------------
  static async export_to_je_fam(data, args)
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
  static redo_fam(data, args)
  {
    if(!args || !args[0])
    {
      data.setAllDirty();
      return;
    }

    data.setDirty(args[0]);
  }
}