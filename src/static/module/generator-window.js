import { RndConf } from "./helper/configuration.js";
import { Creation } from "./creation.js";
import { Recipe } from "./recipe.js";

export class GeneratorWindow extends Application
{
  recipe = null;
  data = null;

  static get defaultOptions()
  {
    return mergeObject(super.defaultOptions,
    {
      popOut: true,
      template: `modules/${RndConf.SCOPE}/templates/generator.hbs`,
      title: game.i18n.localize('RNDNPCS.MISC.WINDOW-TITLE'),
      classes: ["form", "rnd-npcs"],
      width: 350,
      resizable: true
    });
  }

  /**
   * 
   * @param {Recipe} recipe 
   */
  constructor(recipe)
  {
    if(!recipe)
    {
      throw new Error("Cannot initialise Generator Window instance without recipe.")
    }

    const data = new Creation(recipe);
    super(data);

    this.recipe = recipe;
    this.data = data;
  }

  getData()
  {
    console.log("Foo");
  }

  async _redo(ev)
  {
    ev.preventDefault();
    
    const field = ev.currentTarget.dataset.field;
    if("all" === field)
    {
      await this.data.randomiseAll();
    }
    else
    {
      await this.data.trigger(field);
    }

    this.render(true);
  }

  async _toJE(ev)
  {
    ev.preventDefault();

    const je = await JournalEntry.create(
    {
      name: `${this.data.name}`,
      content: this.data.toHtml()
    });

    const folderName = game.settings.get(RndConf.SCOPE, RndConf.CORP_FOLDER);
    if(folderName)
    {
      let folder = game.folders.getName(folderName);
      if(!folder)
      {
        folder = await Folder.create({name: folderName, type:'JournalEntry'});
      }

      await je.update({id:je.id, folder: folder.id});
    }

    je.sheet.render(true);
    this.close();
  }

  activateListeners(html)
  {
    super.activateListeners(html);

    html.find('.redo-btn').click(this._redo.bind(this));
    html.find('.export-btn').click(this._toJE.bind(this));
  }

  getData()
  {
    return this.data;
  }
}