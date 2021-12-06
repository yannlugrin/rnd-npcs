import { RndConf } from "./helper/configuration.js";
import { RndUtil } from "./helper/rnd-util.js";

export class Corp
{
  _name = "";
  _ceo = "";
  _area = "";
  _slogan = "";
  _bestseller = "";


  constructor(options = {})
  {
    this.name       = options.name;
    this.ceo        = options.ceo;
    this.area       = options.area;
    this.slogan     = options.slogan;
    this.bestseller = options.bestseller;
  }

  randomiseAll()
  {
    this.name       = null;
    this.ceo        = null;
    this.area       = null;
    this.slogan     = null;
    this.bestseller = null;
  }

  toHtml()
  {
    return `<h1>${this.name}</h1>`
          +'<div style="display:grid;grid-template-columns:7rem 1fr">'
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.CORP.CEO')}</p><p style="margin:0">${this.ceo}</p>`
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.CORP.AREA')}</p><p style="margin:0">${this.area}</p>`
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.CORP.SLOGAN')}</p><p style="margin:0">${this.slogan}</p>`
          +`<p style="margin:0">${game.i18n.localize('RNDNPCS.CORP.BESTSELLER')}</p><p style="margin:0">${this.bestseller}</p>`
          +'</div><hr />'
  }


  get name() { return this._name; }
  set name(value)
  {
    if((null === value) || (undefined === value))
    {
      this._name = faker.company.companyName();
    }
    else
    {
      this._name = value;
    }
  }


  get ceo() { return this._ceo; }
  set ceo(value)
  {
    if((null === value) || (undefined === value))
    {
      const gender = faker.name.gender(true);
      this._ceo = `${faker.name.firstName(gender)} ${faker.name.lastName(gender)}`;
    }
    else
    {
      this._ceo = value;
    }
  }


  get area() { return this._area; }
  set area(value)
  {
    if((null === value) || (undefined === value))
    {
      this._area = `${faker.commerce.department()}`;
    }
    else
    {
      this._area = value;
    }
  }


  get slogan() { return this._slogan; }
  set slogan(value)
  {
    if((null === value) || (undefined === value))
    {
      this._slogan = `${faker.company.catchPhrase()}`;
    }
    else
    {
      this._slogan = value;
    }
  }


  get bestseller() { return this._bestseller; }
  set bestseller(value)
  {
    if((null === value) || (undefined === value))
    {
      this._bestseller = `${faker.commerce.productName()}`;
    }
    else
    {
      this._bestseller = value;
    }
  }
}
