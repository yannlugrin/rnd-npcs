/**
 * Randomiser Configuration.
 */
export class RndConf
{
  /**
   * The technical name of the module.
   * @readonly
   * @type {String}
   */
  static get SCOPE() { return 'rnd-npcs'; }

  /**
   * Key for the setting to promote changes.
   * @readonly
   * @type {String}
   */
  static get PROMOTE_CHANGES_KEY() { return 'promote_changes'; }

  /**
   * Should changes generally promote?
   * @type {Boolean}
   */
  static get promote_changes() { return game.settings.get( RndConf.SCOPE, RndConf.PROMOTE_CHANGES_KEY ); }
  static set promote_changes(value) { return game.settings.set( RndConf.SCOPE, RndConf.PROMOTE_CHANGES_KEY, value ); }


  /**
   * Key for the setting which locale faker should use.
   * @readonly
   * @type {String}
   */
  static get FAKER_LOCALE_KEY() { return 'faker_locale'; }

  /**
   * The locale that faker uses to generate content.
   * @type {String}
   */
  static get faker_locale() { return game.settings.get( RndConf.SCOPE, RndConf.FAKER_LOCALE_KEY ); }
  static set faker_locale(value) { return game.settings.set( RndConf.SCOPE, RndConf.FAKER_LOCALE_KEY, value ); }

  /**
   * This class only uses static functionality and members. No need for instantiation.
   */
  constructor(){}

  /**
   * @private
   */
  static registerOptions()
  {
    game.settings.register(this.SCOPE, this.PROMOTE_CHANGES_KEY,
    {
      name: game.i18n.localize('RNDNPCS.SETTINGS.PROMOTE_CHANGES'),
      hint: game.i18n.localize('RNDNPCS.SETTINGS.PROMOTE_CHANGES_HINT'),
      scope: 'client',
      type: Boolean,
      default: true,
      config: true
    });

    game.settings.register(this.SCOPE, this.FAKER_LOCALE_KEY,
    {
      name: game.i18n.localize('RNDNPCS.SETTINGS.FAKER_LOCALE'),
      hint: game.i18n.localize('RNDNPCS.SETTINGS.FAKER_LOCALE_HINT'),
      scope: 'client',
      type: String,
      choices:
      {
        az:           'az',
        ar:           'ar',
        cz:           'cz',
        de:           'de',
        de_AT:        'de_AT',
        de_CH:        'de_CH',
        en:           'en',
        en_AU:        'en_AU',
        en_AU_ocker:  'en_AU_ocker',
        en_BORK:      'en_BORK',
        en_CA:        'en_CA',
        en_GB:        'en_GB',
        en_IE:        'en_IE',
        en_IND:       'en_IND',
        en_US:        'en_US',
        en_ZA:        'en_ZA',
        es:           'es',
        es_MX:        'es_MX',
        fa:           'fa',
        fi:           'fi',
        fr:           'fr',
        fr_CA:        'fr_CA',
        fr_CH:        'fr_CH',
        ge:           'ge',
        hy:           'hy',
        hr:           'hr',
        id_ID:        'id_ID',
        it:           'it',
        ja:           'ja',
        ko:           'ko',
        nb_NO:        'nb_NO',
        ne:           'ne',
        nl:           'nl',
        nl_BE:        'nl_BE',
        pl:           'pl',
        pt_BR:        'pt_BR',
        pt_PT:        'pt_PT',
        ro:           'ro',
        ru:           'ru',
        sk:           'sk',
        sv:           'sv',
        tr:           'tr',
        uk:           'uk',
        vi:           'vi',
        zh_CN:        'zh_CN',
        zh_TW:        'zh_TW'
      },
      default: 'en',
      config: true,
      // When updating this option, it's important to inform faker.js about it.
      onChange: value => faker.locale = value
    });
  }
}
