export class ContentGenerationManager
{
  static _gen_funcs = new Map();
  static _post_proc_funcs = new Map();
  
  static init()
  {
    ContentGenerationManager._gen_funcs.set("faker", ContentGenerationManager.faker_gen_func);
    ContentGenerationManager._gen_funcs.set("self", ContentGenerationManager.self_gen_func);
    ContentGenerationManager._gen_funcs.set("table", ContentGenerationManager.rolltable_gen_func);
    ContentGenerationManager._post_proc_funcs.set("tolower", ContentGenerationManager.to_lower_pp_func);
    ContentGenerationManager._post_proc_funcs.set("slugify", ContentGenerationManager.slugify_pp_func);
    ContentGenerationManager._post_proc_funcs.set("camelcase", ContentGenerationManager.camelcase_pp_func);
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

  /**
   * Returns a generator function.
   * @param {String} key 
   * @returns {Method} An async generator method.
   */
  static getGenerator(key)
  {
    if(ContentGenerationManager._gen_funcs.has(key))
    {
      return ContentGenerationManager._gen_funcs.get(key);
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
    if(ContentGenerationManager._post_proc_funcs.has(key))
    {
      return ContentGenerationManager._post_proc_funcs.get(key)(input, args);
    }

    throw new Error(`Post-Processing function '${key}' not found.`);
  }
}