import { Creation } from "./creation.js";

/**
 * @typedef {Object} ActionButtonData
 * @property {String} label Localisation key.
 * @property {String} action Identifier of the action to call.
 * @property {String} icon Font Awesome icon name, i.e. 'fas fa-something'.
 * @property {String} [args] Arguments to pass the called function.
 * @property {Boolean} [is_highlighted] Should the button be highlighted?
 */
  
/**
 * ACTIONBUTTON
 */
export class ActionButton
{
  /**
   * @property {String} _action
   * @private
   */
  _action = "ACTION";
  
  /**
   * @property {String[]} _args
   * @private
   */
  _args = [];
  
  /**
   * @property {String} _label
   * @private
   */
  _label = "LABEL";
  
  /**
   * @property {String} _icon Identifier for Font Awesome icon
   * @private
   */
  _icon = "ICON";
  
  /**
   * @property {boolean} _highlight
   * @private
   */
  _is_highlighted = false;

  /**
   * Creates and instantiates an ActionButton.
   * @param {ActionButtonData} obj 
   * @returns {ActionButton}
   */
  static fromObject(obj)
  {
    const ab = new ActionButton();
    ab._label = obj.label;
    ab._action = obj.action;
    ab._icon = obj.icon;
    ab._args = obj.args?.split(Creation.PART_DELIMITER);
    ab._is_highlighted = obj.is_highlighted;

    return ab;
  }

  /**@type {String} */
  get action() { return this._action; }
  get args() { return this._args; }
  get label() { return this._label; }
  get icon() { return this._icon; }
  get is_highlighted() { return this._is_highlighted; }
}
