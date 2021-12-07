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

    const recipeList = await fetch(`modules/${RndConf.SCOPE}/data/recipes.json`);
    const recipes = await recipeList.json();
    recipes.forEach(el => { RndMain._recipes.push(Recipe.fromObject(el)); });
  
    return preloadTemplates();
  }

  static onGetSceneControlButtons(controls)
  {
    controls.push(
    {
      activeTool: "person",
      icon: "fas fa-diagnoses",
      layer: RndConf.SCOPE,
      name: RndConf.SCOPE,
      title: "RNDNPCS.CONTROLS.GROUP",
      visible: true,
      tools:
      [
        {
          icon: "far fa-id-card",
          name: "person",
          title: "RNDNPCS.CONTROLS.PERSON",
          visible: true,
          onClick: () =>
          {
            new PersonWindow().render(true);
          },
          button: true
        },
        {
          icon: "fas fa-store",
          name: "corp",
          title: "RNDNPCS.CONTROLS.CORP",
          visible: true,
          onClick: () =>
          {
            new CorpWindow().render(true);
          },
          button: true
        }
      ]
    });
  
    const ctrl = controls.filter(el => el.name === RndConf.SCOPE)[0];
    RndMain._recipes.forEach(el =>
    {
      ctrl.tools.push(
      {
        icon: el.icon,
        name: el.name,
        title: game.i18n.localize(el.label),
        visible: true,
        button: true,
        onClick: () =>
        {
          new GeneratorWindow(el).render(true);
        }
      });
    });
  }
}

Hooks.once('init', RndMain.init);

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
