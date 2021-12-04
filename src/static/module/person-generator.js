import { RndConf } from "./helper/configuration.js";

export class PersonGeneratorWindow extends Application
{
  static get defaultOptions()
  {
    return mergeObject(super.defaultOptions,
    {
      popOut: true,
      template: `modules/${RndConf.SCOPE}/templates/person-generator.hbs`,
      title: "Foobar"
    });
  }
}