// Meteor Components
import { _ } from 'lodash';

// App Components
import { Helpers } from '/imports/utils/common';
import { DayPrices } from '/imports/utils/day-prices';

// Template Components
import '/imports/components/loading/loading.component';
import './most-days.component.html';


Template.mostDaysComponent.helpers({

    isLoaded() {
        return !DayPrices.initialLoad.get();
    },

    showLoading() {
        const tplData = Template.currentData();
        return tplData.showLoading || false;
    },

    hasOwnerAtIndex(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.mostDays[index], 'owner', false);
        return (address && !Helpers.isAddressZero(address));
    },

    getAddressAtIndex(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.mostDays[index], 'owner', false);
        if (!address || Helpers.isAddressZero(address)) { return ''; }
        return address;
    },

    getMostDaysAtIndex(index) {
        DayPrices.leaders.changed.get();
        return _.get(DayPrices.leaders.mostDays[index], 'count', '');
    },

    getMostDaysOwnerAtIndex(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.mostDays[index], 'owner') || '';
        const ownerObj = _.find(DayPrices.owners, {address}) || {};
        if (!_.isEmpty(ownerObj)) { ownerObj.changed.get(); }
        return ownerObj.name || '';
    },

    getColorFromAddress(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.mostDays[index], 'owner', false);
        if (!address || Helpers.isAddressZero(address)) { return ''; }
        return Helpers.getStylesForAddress(address);
    },

    getBorderColorFromAddress(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.mostDays[index], 'owner', false);
        if (!address || Helpers.isAddressZero(address)) { return ''; }
        return Helpers.getStylesForAddress(address, 'border');
    }

});
