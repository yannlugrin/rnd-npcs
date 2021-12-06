import { RndConf } from "./helper/configuration.js";
import { Person } from "./person.js";

export class PersonWindow extends Application
{
  data = null;

  static get defaultOptions()
  {
    return mergeObject(super.defaultOptions,
    {
      popOut: true,
      template: `modules/${RndConf.SCOPE}/templates/person-generator.hbs`,
      title: game.i18n.localize('RNDNPCS.MISC.WINDOW-TITLE'),
      classes: ["form", "rnd-npcs"],
      width: 350,
      resizable: true
    });
  }

  constructor(person)
  {
    if((null === person) || (undefined === person))
    {
      person = new Person();
    }

    super(person);
    this.data = person;
  }

  _redo(ev)
  {
    ev.preventDefault();
    
    const field = ev.currentTarget.dataset.field;
    if("all" === field)
    {
      this.data.randomiseAll();
    }
    else
    {
      this.data[field] = null;
    }

    this.render(true);
  }

  async _toJE(ev)
  {
    ev.preventDefault();

    const je = await JournalEntry.create(
    {
      name: `${this.data.first_name} ${this.data.last_name}`,
      content: this.data.toHtml()
    });

    const folderName = game.settings.get(RndConf.SCOPE, RndConf.NPC_FOLDER);
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