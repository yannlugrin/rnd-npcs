import { RndConf } from "./helper/configuration.js";
import { RndUtil } from "./helper/rnd-util.js";

export class Generator
{
  _data = {}
  
  constructor(options = {})
  {
    options.categories?.fields.forEach(element => {
      el
    });
  }

  randomiseAll()
  {
  }

  toHtml()
  {
    return `<h1>${this.full_name}</h1>`
          +'<div style="display:grid;grid-template-columns:7rem 1fr">'
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.PERSON.NICK_NAME')}</p><p style="margin:0">${this.nick_name}</p>`
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.PERSON.EMAIL')}</p><p style="margin:0">${this.email}</p>`
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.PERSON.JOB')}</p><p style="margin:0">${this.job}</p>`
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.PERSON.COMPANY')}</p><p style="margin:0">${this.company}</p>`
          +'</div><hr />'
  }

  nicknameFormulas =
  [
    () => { return `${faker.hacker.ingverb()}${this.first_name}`.replaceAll(' ', '_'); },
    () => { return `Iam${this.first_name}${this.last_name}`; },
    () => { return `${this.first_name}${faker.datatype.number({min:10, max:100})}`; },
    () => { return `${this.first_name}Is${faker.company.catchPhraseAdjective()}`; },
    () => { return `${this.last_name}Is${faker.company.catchPhraseAdjective()}`; },
    () => { return `${this.first_name}${this.last_name}Is${faker.company.catchPhraseAdjective()}`.replaceAll(' ', '_'); },
    () => { return `${this.first_name}_${this.last_name}_${faker.datatype.number({min:10, max:100})}`.toLowerCase(); },
    () => { return `${faker.commerce.department()}-and-${faker.commerce.department()}${faker.datatype.number({min:10, max:100})}`; },
    () => { return `${faker.commerce.department()}-and-${faker.commerce.department()}${faker.commerce.productAdjective()}`; },
    () => { return `${faker.company.catchPhraseAdjective()}-${faker.commerce.productMaterial()}-${faker.animal.type()}`.replaceAll(' ', '_').toLowerCase(); }
  ];



  get first_name() { return this._first_name; }
  set first_name(value)
  {
    if((null === value) || (undefined === value))
    {
      try { this._first_name = faker.name.firstName(this._gender); }
      catch(e) { this._first_name = faker.name.firstName(); }
    }
    else
    {
      this._first_name = value;
    }

    if(game.settings.get(RndConf.SCOPE, RndConf.PROMOTE_CHANGES))
    {
      this.nick_name = null;
      this.email = null;
    }
  }
}
