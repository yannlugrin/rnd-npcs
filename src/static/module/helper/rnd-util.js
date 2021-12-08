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
  static redo_faf(data, args)
  {
    console.log("Redo", args);
    if(!args || !args[0])
    {
      data.setAllDirty();
      return;
    }

    data.setDirty(args[0]);
  }
}