// Meteor Components
import { _ } from 'lodash';

// App Components
import { Helpers } from '/imports/utils/common';
import { DayPrices } from '/imports/utils/day-prices';
import { LocaleHelpers } from '/imports/utils/i18n-helpers';

// Template Components
import '/imports/components/loading/loading.component';
import './month-dominators.component.html';


Template.monthDominatorsComponent.helpers({

    isLoaded() {
        return !DayPrices.initialLoad.get();
    },

    showLoading() {
        const tplData = Template.currentData();
        return tplData.showLoading || false;
    },

    hasOwnerAtIndex(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.monthDomLeaders[index], 'owner', false);
        return (address && !Helpers.isAddressZero(address));
    },

    getAddressAtIndex(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.monthDomLeaders[index], 'owner', false);
        if (!address || Helpers.isAddressZero(address)) { return ''; }
        return address;
    },

    getMonthDominatorsMonthAtIndex(index) {
        DayPrices.leaders.changed.get();
        const month = _.get(DayPrices.leaders.monthDomLeaders[index], 'month', false);
        return (month !== false) ? LocaleHelpers.formatDate('MMMM', month, 1) : '';
    },

    getMonthDominatorsOwnerAtIndex(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.monthDomLeaders[index], 'owner') || '';
        const ownerObj = _.find(DayPrices.owners, {address}) || {};
        if (!_.isEmpty(ownerObj)) { ownerObj.changed.get(); }
        return ownerObj.name || '';
    },

    getColorFromAddress(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.monthDomLeaders[index], 'owner', false);
        if (!address || Helpers.isAddressZero(address)) { return ''; }
        return Helpers.getStylesForAddress(address);
    },

    getBorderColorFromAddress(index) {
        DayPrices.leaders.changed.get();
        const address = _.get(DayPrices.leaders.monthDomLeaders[index], 'owner', false);
        if (!address || Helpers.isAddressZero(address)) { return ''; }
        return Helpers.getStylesForAddress(address, 'border');
    }

});
