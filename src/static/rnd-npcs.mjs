import { RndConf } from "./module/helper/configuration.js";
import { ContentGenerationManager as CGMgr } from "./module/content-generation-mgr.js";
import { BaseContentManager as BCMgr } from "./module/helper/base-content.js";

class RndMain
{
  static _recipes = [];

  static async init()
  {
    console.log("RndNPCs | Initialising...");
    CONFIG.Canvas.layers[RndConf.SCOPE] = CanvasLayer;
    RndConf.registerOptions();
    faker.locale = game.settings.get(RndConf.SCOPE, RndConf.FAKER_LOCALE);

    BCMgr.init();
    CGMgr.init();

  
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
