/**
 * Randomiser Configuration.
 */
export class RndConf
{
  /**
   * @member {string} - The technical name of the module.
   */
  static get SCOPE() { return 'rnd-npcs'; }

  /**
   * @member {string} - Key for the setting to promote changes.
   */
  static get PROMOTE_CHANGES() { return 'promote_changes'; }

  /**
   * @member {string} - Key for the setting where to store npcs.
   */
  static get NPC_FOLDER() { return 'npc_folder'; }

  /**
   * @member {string} - Key for the setting where to store corps.
   */
  static get CORP_FOLDER() { return 'corp_folder'; }

  /**
   * @member {string} - Key for the setting which locale faker should use.
   */
  static get FAKER_LOCALE() { return 'faker_locale'; }

  static registerOptions()
  {
    game.settings.register(this.SCOPE, this.PROMOTE_CHANGES,
    {
      name: game.i18n.localize('RNDNPCS.SETTINGS.PROMOTE_CHANGES'),
      hint: game.i18n.localize('RNDNPCS.SETTINGS.PROMOTE_CHANGES_HINT'),
      scope: 'client',
      type: Boolean,
      default: false,
      config: true
    });

    game.settings.register(this.SCOPE, this.NPC_FOLDER,
    {
      name: game.i18n.localize('RNDNPCS.SETTINGS.NPC_FOLDER'),
      hint: game.i18n.localize('RNDNPCS.SETTINGS.NPC_FOLDER_HINT'),
      scope: 'client',
      type: String,
      default: 'NPCs',
      config: true
    });

    game.settings.register(this.SCOPE, this.CORP_FOLDER,
    {
      name: game.i18n.localize('RNDNPCS.SETTINGS.CORP_FOLDER'),
      hint: game.i18n.localize('RNDNPCS.SETTINGS.CORP_FOLDER_HINT'),
      scope: 'client',
      type: String,
      default: 'Corps',
      config: true
    });

    game.settings.register(this.SCOPE, this.FAKER_LOCALE,
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
      onChange: value => faker.locale = value
    });
  }
}
