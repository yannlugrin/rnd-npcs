export class ActionButton
{
  _action = "ACTION";
  _args = [];
  _label = "LABEL";
  _icon = "ICON";
  _highlight = false;

  static fromObject(obj)
  {
    const ab = new ActionButton();
    ab._label = obj.label;
    ab._action = obj.action;
    ab._icon = obj.icon;
    ab._args = obj.args;
    ab._highlight |= obj.highlight;

    return ab;
  }

  get action() { return this._action; }
  get args() { return this._args; }
  get label() { return this._label; }
  get icon() { return this._icon; }
  get highlight() { return this._highlight; }
}