import { RndConf } from "./helper/configuration.js";
import { Creation } from "./creation.js";
import { Recipe } from "./recipe.js";
import { ContentGenerationManager as CMgr } from "./content-generation-mgr.js";

export class GeneratorWindow extends Application
{
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

    this.data = data;
  }

  async getData()
  {
    await this.data.resolveDirty();

    return this.data;
  }

  async form_action(ev)
  {
    ev.preventDefault();
    const action = ev.currentTarget.dataset.action;
    const args = ev.currentTarget.dataset.args?.split(Creation.PART_DELIMITER);
    
    CMgr.execFormAction(action, this.data, args);
    this.render(true);
  }

  activateListeners(html)
  {
    super.activateListeners(html);

    html.find('.action-btn').click(this.form_action.bind(this));
  }
}