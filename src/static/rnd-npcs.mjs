import { USC } from "./module/helper/configuration.js"

Hooks.once('init', () =>
{
  console.log("RndNPCs | Initialising...");

  return preloadTemplates();
});

async function preloadTemplates()
{
  // Load templates
  const list = await fetch(`modules/${USC.SCOPE}/data/templateList.json`);
  const files = await list.json();
  return loadTemplates(files);
}
