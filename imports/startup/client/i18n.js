// Meteor Components
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// App Components
import { LocaleHelpers } from '/imports/utils/i18n-helpers';


// Configure i18n Component
Meteor.startup(function i18nStartup() {
    // Get Default Locale
    let defaultLocale = 'en';
    if (localStorage.getItem('OTDi18n')) {
        defaultLocale = localStorage.getItem('OTDi18n');
    } else {
        defaultLocale = navigator.language || navigator.userLanguage;
    }
    LocaleHelpers.setLanguage(defaultLocale);

    Tracker.autorun(function() {
        LocaleHelpers.currentLocale = TAPi18n.getLanguage();
        if(_.isString(LocaleHelpers.currentLocale)) {
            Meta.setSuffix(TAPi18n.__('page.defaultSuffix'));
        }
    });
});

// Override Template Helper provided by TAPi18n
//   - this fix prevents empty strings from displaying as: "key 'project: (en)' returned an object instead of string."
Template.registerHelper('_', (key, ...args) => {
    if (!key || !key.length) { return ''; }
    const options = (args.pop()).hash || {};
    return TAPi18n.__(key, options);
});
