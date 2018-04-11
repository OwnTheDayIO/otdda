// Meteor Components
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { Random } from 'meteor/random';
import * as profanityFilter from 'profanity-filter';
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Contract } from '/imports/contract/contract-interface';
import { PendingTransactions } from '/imports/utils/pending-transactions';
import { LocaleHelpers } from '/imports/utils/i18n-helpers';
import { Helpers } from '/imports/utils/common';
import { DayPrices } from '/imports/utils/day-prices';
import { log } from '/imports/utils/logging';

// Globals
import {
    TOTAL_DAYS,
    DAYS_IN_MONTH,
    PRICE_WATCH_INTERVAL,
    ACCOUNT_WATCH_INTERVAL,
    MAX_LEADER_COUNT
} from '/imports/utils/global-constants';

// Template Components
import '/imports/modals/error/error.modal';
import '/imports/modals/nickname/nickname.modal';
import '/imports/modals/claim/claim.modal';
import './body.html';

let _priceMonitorId;
let _accountMonitorId;

let _currentFetchCount = 0;
let _fetchLimit = 100;

Template.bodyLayout.onCreated(function Template_bodyLayout_onCreated() {
    const instance = this;
    instance.eth = MeteorEthereum.instance();
    instance.contract = Contract.instance();

    Session.setDefault('selectedMonth', 0);
    Session.setDefault('selectedDay', 1);
    Session.setDefault('accountNickname', '');
    Session.setDefault('latestClaim', {});

    instance.lastMostDaysLeaders = [];
    instance.lastMonthDominators = [];

    // Monitor Existing Transactions
    instance.autorun(computation => {
        if (!instance.eth.hasNetwork) { return; }
        PendingTransactions.monitor(instance.contract);
        computation.stop();
    });

    let lastKnownCoinbase = '';
    instance.autorun(computation => {
        if (!instance.eth.hasNetwork) { return; }
        computation.stop();

        // Let's watch the Coinbase Account of the User
        _accountMonitorId = Meteor.setInterval(function () {
            const coinbase = instance.eth.web3.eth.coinbase;

            // Check if the Coinbase Account has changed
            if (lastKnownCoinbase === coinbase) { return; }
            lastKnownCoinbase = coinbase;

            // Reactively update the Coinbase Account
            instance.eth.coinbase = coinbase;
            instance.eth.hasAccount = !_.isEmpty(coinbase);

            // Use Address as Nickname
            Session.set('accountNickname', Helpers.shortAddress(instance.eth.coinbase));
            _getAccountNickname(instance);
        }, ACCOUNT_WATCH_INTERVAL);
    });

    // Monitor Account Nickname
    instance.autorun(() => {
        Session.get('latestClaim');
        _updateOwnedDays(instance, Session.get('accountNickname'));
    });

    // Begin Monitoring All Prices
    instance.autorun(() => {
        if (!instance.eth.hasNetwork) { return; }
        _monitorPrices(instance);
    });

    // Update Price after a Claim
    // instance.autorun(() => {
    //     if (!instance.eth.hasNetwork) { return; }
    //     _updatePriceAfterClaim(instance, Session.get('latestClaim'));
    // });
});

Template.bodyLayout.onRendered(function Template_bodyLayout_onRendered() {
    // Set Page Desc
    Meta.set('description', TAPi18n.__('page.desc'));

    Meteor.defer(() => {
        $('.dropdown-toggle').dropdown();
        $('[data-toggle="tooltip"]').tooltip();
    });

    // if (/development/i.test(process.env.NODE_ENV)) {
    //     for (let i = 0; i < 366; i++) {
    //         const {month, day} = Helpers.getMonthDayFromIndex(i);
    //         console.log(i, ' = ', month + 1, day);
    //     }
    // }
});

Template.bodyLayout.onDestroyed(function Template_bodyLayout_onDestroyed() {
    if (_priceMonitorId) {
        Meteor.clearInterval(_priceMonitorId);
    }
    if (_accountMonitorId) {
        Meteor.clearInterval(_accountMonitorId);
    }
});

Template.bodyLayout.helpers({

    getAccountAddress() {
        const instance = Template.instance();
        if (!instance.eth.hasAccount) { return ''; }
        return instance.eth.coinbase;
    },

    getCalendarRoute() {
        return FlowRouter.path('calendar');
    },

    getAccountRoute() {
        return FlowRouter.path('account');
    },

    getActiveClass(route) {
        return (_.endsWith(FlowRouter.getRouteName(), route)) ? 'active' : '';
    },

    getAccountNickname() {
        const instance = Template.instance();
        if (!instance.eth.hasAccount) { return ''; }
        return Session.get('accountNickname');
    },

    getColorFromAddress() {
        const instance = Template.instance();
        if (!instance.eth.hasAccount) { return ''; }
        return Helpers.getStylesForAddress(instance.eth.coinbase);
    },

    hasRecentClaim() {
        const instance = Template.instance();
        if (!instance.eth.hasAccount) { return ''; }
        return !_.isEmpty(Session.get('latestClaim'));
    },

    hasPendingTxs() {
        return false;// PendingTransactions.getTransactionCount() > 0;
    },

    getPendingTxs() {
        //return [{hash: '0xa80a97cd70acfd783a3ba008b1b038759702327055a2d97e080bb5a8af730c91', claimData: {day: 1}}];
        return PendingTransactions.getTransactions();
    },

    getFriendlyDate(tx) {
        const {month, day} = Helpers.getMonthDayFromIndex(tx.claimData.day);
        return LocaleHelpers.formatDate('MMMM Do', month, day);
    }

});

Template.bodyLayout.events({

    'click .dropdown-toggle': event => { event.preventDefault(); },

    'click [href="#"]': event => { event.preventDefault(); },

    'click [data-action="change-lang"]' : event => {
        const $target = $(event.currentTarget);
        LocaleHelpers.setLanguage($target.attr('data-lang') || 'en');
    },

    'click [data-goto]': (event, instance) => {
        event.stopPropagation();
        event.preventDefault();
        Helpers.gotoAccount($(event.currentTarget).attr('data-goto'));
    }

});

/**
 * @summary
 * @param instance
 * @private
 */
function _getAccountNickname(instance) {
    if (instance.view.isDestroyed || _.isEmpty(instance.eth.coinbase)) { return; }

    // Get Nickname from Contract
    Helpers.getFriendlyOwnerName(instance.contract, instance.eth.coinbase)
        .then(name => {
            Session.set('accountNickname', profanityFilter.clean(name));
        })
        .catch(log.error);
}

/**
 * @summary
 * @param instance
 * @private
 */
function _updateOwnedDays(instance, ownerName) {
    if (instance.view.isDestroyed || _.isEmpty(instance.eth.coinbase)) { return; }
    const ownerAddress = instance.eth.coinbase;
    const ownedDayIndices = _.filter(_.map(DayPrices.owners, (obj, idx) => obj.address === ownerAddress ? idx : null), _.isNumber);
    for (let i = 0; i < ownedDayIndices.length; i++) {
        _updateOwnerName(ownedDayIndices[i], ownerAddress, ownerName);
    }
}

/**
 * @summary
 * @param instance
 * @param idx
 * @returns {function(*)}
 * @private
 */
const _addPrice = function Template_bodyLayout_monitorPrices_addPrice(instance, dayIndex) {
    return (price) => {
        if (_.isUndefined(DayPrices.prices[dayIndex])) {
            DayPrices.prices[dayIndex] = {price: 0, changed: new ReactiveVar('')};
            DayPrices.owners[dayIndex] = {address: 0, name: '', changed: new ReactiveVar('')};
        }

        if (!DayPrices.prices[dayIndex].price || !price.eq(DayPrices.prices[dayIndex].price)) {
            DayPrices.prices[dayIndex].price = price;
            DayPrices.prices[dayIndex].changed.set(Random.id());
            return instance.contract.getDayOwner(dayIndex)
                .then(owner => _updateDayOwner(instance, dayIndex, owner));
        }
        return Promise.resolve(true);
    };
};

const _updateDayOwner = function Template_bodyLayout_monitorPrices_updateDayOwner(instance, dayIndex, owner) {
    DayPrices.owners[dayIndex].address = owner;
    DayPrices.owners[dayIndex].changed.set(Random.id());
    if (Helpers.isAddressZero(owner)) {
        return Promise.resolve(true);
    }

    if (!_.isUndefined(DayPrices.nameCache[owner])) {
        if (DayPrices.owners[dayIndex].name !== DayPrices.nameCache[owner]) {
            DayPrices.owners[dayIndex].name = DayPrices.nameCache[owner];
            DayPrices.owners[dayIndex].changed.set(Random.id());
        }
        return Promise.resolve(true);
    } else {
        return Helpers.getFriendlyOwnerName(instance.contract, owner)
            .then(name => _updateOwnerName(dayIndex, owner, name));
    }
};

const _updateOwnerName = function Template_bodyLayout_monitorPrices_updateDayOwner(dayIndex, owner, ownerName) {
    ownerName = profanityFilter.clean(ownerName);
    if (DayPrices.owners[dayIndex].name !== ownerName) {
        DayPrices.owners[dayIndex].name = ownerName;
        DayPrices.nameCache[owner] = ownerName;
        DayPrices.owners[dayIndex].changed.set(Random.id());
    }
};

/**
 * @summary
 * @param prices
 * @param priceToFind
 * @returns {Array}
 * @private
 */
const _getIndicesOf = (prices, priceToFind) => {
    const indices = [];
    _.forEach(prices, (priceObj, i) => {
        if (priceObj.price.eq(priceToFind)) {
            indices.push(i);
        }
    });
    return indices;
};

/**
 * @summary
 * @param prices
 * @param isGreaterCallback
 * @returns {*}
 * @private
 */
const _getMaxPriceBy = (prices, isGreaterCallback) => {
    let maxPrice = {price: new BigNumber(0)};
    _.forEach(prices, (priceObj) => {
        if (isGreaterCallback(priceObj.price, maxPrice.price)) {
            maxPrice = priceObj;
        }
    });
    return maxPrice;
};

const _updateLeaders = (instance) => {
    // Get Leading Prices
    const firstHigh = _getMaxPriceBy(DayPrices.prices, (price, max) => price.gt(max));
    const secondHigh = _getMaxPriceBy(DayPrices.prices, (price, max) => price.eq(firstHigh.price) ? false : price.gt(max));
    const thirdHigh = _getMaxPriceBy(DayPrices.prices, (price, max) => (price.eq(firstHigh.price) || price.eq(secondHigh.price)) ? false : price.gt(max));

    // Get Indices of Leading Prices
    const firstHighDays = _getIndicesOf(DayPrices.prices, firstHigh.price);
    const secondHighDays = _getIndicesOf(DayPrices.prices, secondHigh.price);
    const thirdHighDays = _getIndicesOf(DayPrices.prices, thirdHigh.price);

    // Get Most-Days Owners
    DayPrices.leaders.mostDays = _.chain(DayPrices.owners)
        .groupBy(owner => owner.address)
        .map((val, key) => ({owner: key, count: val.length}))
        .orderBy('count', ['desc'])
        .filter(obj => !Helpers.isAddressZero(obj.owner))
        .take(MAX_LEADER_COUNT)
        .value();

    // Get Month Dominators
    let dayOwner;
    let dayIndex = 0;
    const monthDominators = [];
    for (let m = 0; m < DAYS_IN_MONTH.length; m++) {
        monthDominators[m] = monthDominators[m] || {};

        // Determine count of all owners in month
        for (let d = 0; d < DAYS_IN_MONTH[m]; d++, dayIndex++) {
            dayOwner = DayPrices.owners[dayIndex].address;
            monthDominators[m][dayOwner] = monthDominators[m][dayOwner] || {count: 0};
            monthDominators[m][dayOwner].count++;
        }

        // Determine month dominator
        monthDominators[m] = _.chain(monthDominators[m])
            .map((val, key) => ({month: m, owner: key, count: val.count}))
            .orderBy('count', ['desc'])
            .filter(obj => !Helpers.isAddressZero(obj.owner))
            .get('[0]', {month: m, count: 0})
            .value();
    }
    DayPrices.leaders.monthDominators = monthDominators;
    DayPrices.leaders.monthDomLeaders = _.take(_.orderBy(monthDominators, 'count', ['desc']), MAX_LEADER_COUNT);

    // Check if Leaders have changed
    let hasChanges = false;
    if (!DayPrices.leaders.first.price || !DayPrices.leaders.first.price.eq(firstHigh.price)) { hasChanges = true; }
    if (!DayPrices.leaders.second.price || !DayPrices.leaders.second.price.eq(secondHigh.price)) { hasChanges = true; }
    if (!DayPrices.leaders.third.price || !DayPrices.leaders.third.price.eq(thirdHigh.price)) { hasChanges = true; }
    if (DayPrices.leaders.first.days.length !== firstHighDays.length) { hasChanges = true; }
    if (DayPrices.leaders.second.days.length !== secondHighDays.length) { hasChanges = true; }
    if (DayPrices.leaders.third.days.length !== thirdHighDays.length) { hasChanges = true; }

    // Changes to Most-Days Leaders?
    _.forEach(DayPrices.leaders.mostDays, (leader, idx) => {
        if (leader.owner !== instance.lastMostDaysLeaders[idx]) {
            instance.lastMostDaysLeaders[idx] = leader.owner;
            hasChanges = true;
        }
    });

    // Changes to Month Dominators?
    _.forEach(DayPrices.leaders.monthDominators, (leader, idx) => {
        if (!leader) { return; }
        if (leader.owner !== instance.lastMonthDominators[idx]) {
            instance.lastMonthDominators[idx] = leader.owner;
            hasChanges = true;
        }
    });


    // Store Leading Prices and Indices
    DayPrices.leaders.first.price = firstHigh.price;
    DayPrices.leaders.second.price = secondHigh.price;
    DayPrices.leaders.third.price = thirdHigh.price;
    DayPrices.leaders.first.days = firstHighDays.slice(0);
    DayPrices.leaders.second.days = secondHighDays.slice(0);
    DayPrices.leaders.third.days = thirdHighDays.slice(0);

    return hasChanges;
};

/**
 * @summary
 * @param instance
 * @private
 */
function _monitorPrices(instance) {
    if (!instance.eth.hasNetwork || instance.view.isDestroyed) { return; }
    if (_priceMonitorId) { Meteor.clearTimeout(_priceMonitorId); }
    const initialLoad = DayPrices.initialLoad.get();

    const start = (new Date).getTime();
    const promises = [];
    const limit = initialLoad ? TOTAL_DAYS : Math.min(_currentFetchCount + _fetchLimit, TOTAL_DAYS);
    for (let i = _currentFetchCount; i < limit; i++) {
        promises.push(instance.contract.getDayPrice(i).then(_addPrice(instance, i, true)));
    }
    _currentFetchCount += initialLoad ? 0 : _fetchLimit;
    if (_currentFetchCount > TOTAL_DAYS) { _currentFetchCount = 0; }
    Promise.all(promises)
        .then(result => {
            // Check if Leaders have changed
            let hasChanges = _updateLeaders(instance);

            // Finished Initial Load
            DayPrices.initialLoad.set(false);

            // Clear NameCache
            DayPrices.nameCache = {};

            // Trigger Leaderboard Changes
            if (hasChanges) {
                DayPrices.leaders.changed.set(Random.id());
            }

            // Re-run Monitor
            const timeTaken = (new Date).getTime() - start;
            if (timeTaken < PRICE_WATCH_INTERVAL) {
                _priceMonitorId = Meteor.setTimeout(() => _monitorPrices(instance), PRICE_WATCH_INTERVAL - timeTaken);
            } else {
                _monitorPrices(instance);
            }
        })
        .catch(err => {
            log.error(err);
            _monitorPrices(instance);
        });
}


/**
 * @summary
 * @param instance
 * @private
 */
function _updatePriceAfterClaim(instance, latestClaim) {
    if (!instance.eth.hasNetwork || instance.view.isDestroyed) { return; }
    if (_.isEmpty(latestClaim)) { return; }

    instance.contract.getDayPrice(latestClaim.day)
        .then(_addPrice(instance, latestClaim.day))
        .then(() => {
            if (_updateLeaders(instance)) {
                DayPrices.leaders.changed.set(Random.id());
            }
        })
        .catch(log.error);
}
