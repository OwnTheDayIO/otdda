// Meteor Components
import { Random } from 'meteor/random';
import { TAPi18n } from 'meteor/tap:i18n';
import { format } from 'date-fns';
import * as fr from 'date-fns/locale/fr';
import * as de from 'date-fns/locale/de';
import * as es from 'date-fns/locale/es';
import * as nl from 'date-fns/locale/nl';
import * as ru from 'date-fns/locale/ru';
import * as ko from 'date-fns/locale/ko';
import * as ja from 'date-fns/locale/ja';
import * as zh_cn from 'date-fns/locale/zh_cn';
import { _ } from 'lodash';

// App Components
import { log } from '/imports/utils/logging';

const _locales = {fr, de, es, ru, nl, ja, ko, zh: zh_cn};


export class LocaleHelpers {

    static setLanguage(lang) {
        let userLang = 'en';
        const availLang = TAPi18n.getLanguages();
        if (_.isObject(availLang) && availLang[lang]) {
            userLang = lang;
        } else if (_.isObject(availLang) && availLang[lang.substr(0,2)]) {
            userLang= lang.substr(0,2);
        }
        TAPi18n.setLanguage(userLang)
            .done(() => {
                LocaleHelpers.localeDep.changed();
                localStorage.setItem('OTDi18n', userLang);
                //log.info(`TAPi18n - Language Set to "${userLang}"`);
            })
            .fail((err) => {
                log.error(`TAPi18n.setLanguage Failed; ${err}`);
            });
    }

    static formatDate(dateFormat, month, day = 1) {
        const options = {};
        if (LocaleHelpers.currentLocale !== 'en') {
            options.locale = _locales[LocaleHelpers.currentLocale];
        }
        LocaleHelpers.localeDep.depend();
        const date = new Date(2020, _.parseInt(month, 10) || 0, _.parseInt(day, 10) || 1); // 2020 has 29 days in Feb
        return format(date, dateFormat, options);
    }

}

LocaleHelpers.currentLocale = 'en';
LocaleHelpers.localeDep = new Tracker.Dependency;
