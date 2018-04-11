// Meteor Components
import { Random } from 'meteor/random';
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { LocaleHelpers } from '/imports/utils/i18n-helpers';
import { SvgImage } from '/imports/utils/svg-image';
import { log } from '/imports/utils/logging';

// Globals
import {
    MONTH_INDICES
} from '/imports/utils/global-constants';


Template.registerHelpers({

    isReady() {
        const eth = MeteorEthereum.instance();
        return eth.isReady;
    },

    hasValidBrowser() {
        const eth = MeteorEthereum.instance();
        return eth.hasWeb3Browser;
    },

    hasValidAccount() {
        const eth = MeteorEthereum.instance();
        return eth.hasAccount;
    },

    hasValidNetwork() {
        const eth = MeteorEthereum.instance();
        return eth.hasNetwork;
    },

    hasValidAccountAndNetwork(accountId = '') {
        const eth = MeteorEthereum.instance();
        return eth.hasNetwork && (eth.hasAccount || accountId.length);
    },

    hasInvalidBrowser() {
        const eth = MeteorEthereum.instance();
        return !eth.hasWeb3Browser;
    },

    hasInvalidAccount() {
        const eth = MeteorEthereum.instance();
        return !eth.hasAccount;
    },

    hasInvalidNetwork() {
        const eth = MeteorEthereum.instance();
        return !eth.hasNetwork;
    },

    hasInvalidAccountOrNetwork() {
        const eth = MeteorEthereum.instance();
        return !eth.hasNetwork || !eth.hasAccount;
    },

    getOfflineReason() {
        const eth = MeteorEthereum.instance();
        if (eth.hasNetwork && !eth.hasAccount) { return TAPi18n.__('body.navbar.notConnected'); }
        if (!eth.hasNetwork) { return TAPi18n.__('body.navbar.noNetwork'); }
        return '';
    },

    getCorrectNetworkName() {
        const env = process.env.NODE_ENV;
        const msg = (env === 'development')
            ? 'component.accountWarning.wrongNetwork.messageTest'
            : 'component.accountWarning.wrongNetwork.messageMain';
        return TAPi18n.__(msg);
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Language Helpers
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    getLanguages() {
        return _.keys(TAPi18n.getLanguages());
    },

    getLangName(lang) {
        return TAPi18n.getLanguages()[lang].name;
    },

    getActiveLangName() {
        const languages = TAPi18n.getLanguages();
        const active = TAPi18n.getLanguage();
        return languages[active].name;
    },

    getActiveLangClass(lang) {
        return TAPi18n.getLanguage() === lang;
    },

    getLinkedTranslationFor(translationKey) {
        const options = {};
        const linkKeys = _.compact(TAPi18n.__(translationKey).match(/__[A-Za-z0-9-_]*__/g));
        _.forEach(linkKeys, routeKey => {
            const route = _.trim(routeKey, '_');
            const path = FlowRouter.path(`app.${route}`);
            const title = TAPi18n.__(`${route}.pageTitle`);
            options[route] = `<a href="${path}">${title}</a>`;
        });
        return TAPi18n.__(translationKey, options);
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Date Helpers
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    getMonths() {
        return MONTH_INDICES;
    },

    getDateLabel(format, month = false, day = false) {
        if (month === false) { month = Session.get('selectedMonth'); }
        if (day === false) { day = Session.get('selectedDay'); }
        return LocaleHelpers.formatDate(format, month, day);
    },

    getActiveMonthClass(month) {
        return Session.get('selectedMonth') === month ? 'active' : '';
    },

    getActiveMonth() {
        return Session.get('selectedDay');
    },

    getActiveDay() {
        return Session.get('selectedDay');
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Common Helpers
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    getRoute(routeNameOrPath, routeParams = {}) {
        return FlowRouter.path(routeNameOrPath, routeParams);
    },

    getSvg(filepath, classname) {
        return SvgImage.getSvg(filepath, classname);
    },

    log(object) {
        log.log(object);
    }
});
