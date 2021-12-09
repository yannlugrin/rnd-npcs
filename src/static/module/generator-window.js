import { RndConf } from "./helper/rnd-conf.js";
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
   * The window class that is responsible for handling the visual interfacing between Creation and user, closest to the user.
   * @param {Recipe} recipe The Recipe that gets passed down to the Creation.
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