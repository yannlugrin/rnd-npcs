import { RndConf } from "./module/helper/configuration.js"
import { RndNpcLayer } from "./module/rnd-npc-layer.js"
import { PersonWindow } from "./module/person-window.js"
import { CorpWindow } from "./module/corp-window.js"

Hooks.once('init', () =>
{
  console.log("RndNPCs | Initialising...");
  CONFIG.Canvas.layers[RndConf.SCOPE] = CanvasLayer;
  RndConf.registerOptions();
  faker.locale = game.settings.get(RndConf.SCOPE, RndConf.FAKER_LOCALE);

  return preloadTemplates();
});

Hooks.on('getSceneControlButtons', (controls) =>
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
});

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
