// Meteor Components
import { Random } from 'meteor/random';
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { DayPrices } from '/imports/utils/day-prices';

// Template Component
import '/imports/components/day-card/day-card.component';
import './my-days.component.html';

let _daysMonitorId;
let _lastKnownAccount = '';


Template.myDaysComponent.onCreated(function Template_myDaysComponent_onCreated() {
    const instance = this;
    instance.eth = MeteorEthereum.instance();
    instance.loading = new ReactiveVar(true);

    let accountId = instance.data.accountId || instance.eth.coinbase || '';
    instance.accountId = new ReactiveVar(accountId);
    instance.ownedDays = new ReactiveVar([]);

    // Begin Monitoring Days Owned
    instance.autorun(() => {
        const hasAccount = instance.eth.hasAccount; // used to trigger autorun
        const coinbase = instance.eth.coinbase;
        accountId = Template.currentData().accountId || coinbase;

        if (_.isEmpty(_lastKnownAccount) || _lastKnownAccount !== accountId) {
            _lastKnownAccount = accountId;
            instance.loading.set(true);
        }
        if (_.isEmpty(accountId)) { return; }
        instance.accountId.set(accountId);
    });

    const _getOwnedDays = (acctId) => {
        const ownedDayIndices = _.filter(_.map(DayPrices.owners, (obj, idx) => obj.address === acctId ? idx : null), _.isNumber);
        instance.ownedDays.set(ownedDayIndices);
        instance.loading.set(false);
    };
    instance.autorun(() => {
        instance.loading.set(true);

        // Triggers
        accountId = instance.accountId.get();
        DayPrices.leaders.changed.get();
        Session.get('latestClaim'); // Day Claimed; Price/Owner changed

        // Update Owned Days
        if (_.isEmpty(accountId)) { return; }
        _getOwnedDays(accountId);
    });
});

Template.myDaysComponent.onDestroyed(function Template_myDaysComponent_onDestroyed() {
    if (_daysMonitorId) {
        Meteor.clearTimeout(_daysMonitorId);
    }
});

Template.myDaysComponent.helpers({

    isLoading() {
        const instance = Template.instance();
        return instance.loading.get();
    },

    isCurrentUser() {
        const instance = Template.instance();
        return instance.accountId.get() === instance.eth.coinbase;
    },

    ownsDays() {
        const instance = Template.instance();
        if (DayPrices.initialLoad.get()) { return false; }
        return instance.ownedDays.get().length > 0;
    },

    getDaysOwned() {
        const instance = Template.instance();
        if (DayPrices.initialLoad.get()) { return false; }
        return instance.ownedDays.get();
    }

});
