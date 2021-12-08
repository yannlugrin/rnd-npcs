import { RndConf } from "./module/helper/configuration.js";
import { PersonWindow } from "./module/person-window.js";
import { CorpWindow } from "./module/corp-window.js";
import { Recipe } from "./module/recipe.js";
import { GeneratorWindow } from "./module/generator-window.js";
import { ContentGenerationManager as CGMgr } from "./module/content-generation-mgr.js";

class RndMain
{
  static _recipes = [];

  static async init()
  {
    console.log("RndNPCs | Initialising...");
    CONFIG.Canvas.layers[RndConf.SCOPE] = CanvasLayer;
    RndConf.registerOptions();
    faker.locale = game.settings.get(RndConf.SCOPE, RndConf.FAKER_LOCALE);

    CGMgr.init();

    const recipe_file = await fetch(`modules/${RndConf.SCOPE}/data/recipes.json`);
    const recipe_list = await recipe_file.json();
    recipe_list.recipes.forEach(el => { CGMgr.add_recipe(el); });
  
    console.log("Init done");
    return preloadTemplates();
  }

  static async ready()
  {
    console.log("RndNPCs | Readying...");
  }

  static onGetSceneControlButtons(controls)
  {
    controls.push(
    {
      activeTool: null,
      icon: "fas fa-diagnoses",
      layer: RndConf.SCOPE,
      name: RndConf.SCOPE,
      title: "RNDNPCS.CONTROLS.GROUP",
      visible: true,
      tools: CGMgr.getSceneButtons()
    });
  }
}

Hooks.once('init', RndMain.init);
Hooks.once('ready', RndMain.ready);
Hooks.on('getSceneControlButtons', RndMain.onGetSceneControlButtons);

async function preloadTemplates()
{
  // Load templates
  const list = await fetch(`modules/${RndConf.SCOPE}/data/templateList.json`);
  const files = await list.json();
  return loadTemplates(files);
}

Handlebars.registerHelper('faker', (key) =>
{
  return foundry.utils.getProperty(faker, key)();
});
