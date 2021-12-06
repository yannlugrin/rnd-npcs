import { RndConf } from "./helper/configuration.js";
import { RndUtil } from "./helper/rnd-util.js";

export class Person
{
  _first_name = "";
  _last_name = "";
  _nick_name = "";
  _gender = "";
  _email = "";
  _job = "";
  _company = "";
  
  constructor(options = {})
  {
    this.gender     = options.gender;
    this.first_name = options.first_name;
    this.last_name  = options.last_name;
    this.nick_name  = options.nick_name;
    this.email      = options.email;
    this.job        = options.job;
    this.company    = options.company;
  }

  randomiseAll()
  {
    this.gender     = null;
    this.first_name = null;
    this.last_name  = null;
    this.nick_name  = null;
    this.email      = null;
    this.job        = null;
    this.company    = null;
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


  get gender() { return this._gender; }
  set gender(value)
  {
    if((null === value) || (undefined === value))
    {
      // As long as gender isn't shown to user, we can safely work binary and
      // let the user interpret the result on whatever spectrum they want.
      this._gender = faker.name.gender(true);
    }

    this._gender = value;
  }



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



  get last_name() { return this._last_name; }
  set last_name(value)
  {
    if((null === value) || (undefined === value))
    {
      try { this._last_name = faker.name.lastName(this._gender); }
      catch(e) { this._last_name = faker.name.lastName(); }
    }
    else
    {
      this._last_name = value;
    }

    if(game.settings.get(RndConf.SCOPE, RndConf.PROMOTE_CHANGES))
    {
      this.nick_name = null;
      this.email = null;
    }
  }



  get full_name() { return `${this.first_name} ${this.last_name}`; }



  get nick_name() { return this._nick_name; }
  set nick_name(value)
  {
    if((null === value) || (undefined === value))
    {
      this._nick_name = this.nicknameFormulas[faker.datatype.number({max:this.nicknameFormulas.length - 1})]();
    }
    else
    {
      this._nick_name = value;
    }

    if(game.settings.get(RndConf.SCOPE, RndConf.PROMOTE_CHANGES))
    {
      this.email = null;
    }
  }



  get email() { return this._email; }
  set email(value)
  {
    if((null === value) || (undefined === value))
    {
      this._email = faker.internet.email(this._first_name, this._last_name);
    }
    else
    {
      this._email = value;
    }
  }



  get job() { return this._job; }
  set job(value)
  {
    if((null === value) || (undefined === value))
    {
      this._job = faker.name.jobTitle();
    }
    else
    {
      this._job = value;
    }
  }



  get company() { return this._company; }
  set company(value)
  {
    if((null === value) || (undefined === value))
    {
      this._company = faker.company.companyName();
    }
    else
    {
      this._company = value;
    }
  }
}
