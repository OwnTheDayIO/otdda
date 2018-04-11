// Meteor Components
import { Random } from 'meteor/random';
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Contract } from '/imports/contract/contract-interface';
import { Helpers } from '/imports/utils/common';
import { DayPrices } from '/imports/utils/day-prices';

// Globals
import {
    HOLIDAY_ICON_MAP
} from '/imports/utils/global-constants';

// Template Component
import './calendar-day.component.html';

Template.calendarDayComponent.onCreated(function Template_calendarDayComponent_onCreated() {
    const instance = this;
    instance.eth = MeteorEthereum.instance();
    instance.contract = Contract.instance();

    // Get Index of Day
    let range = Helpers.getDayIndexRange(instance.data.data.month);

    instance.standalone = instance.data.data.standalone || false;
    instance.dayToDisplay = new ReactiveVar(instance.data.data.day);
    instance.dayIndex = new ReactiveVar(range[0] + instance.data.data.day - 1);

    instance.autorun(() => {
        const tplData = Template.currentData();
        Session.get('accountNickname');

        range = Helpers.getDayIndexRange(tplData.data.month);
        instance.dayToDisplay.set(tplData.data.day);
        instance.dayIndex.set(range[0] + tplData.data.day - 1);
    });
});

Template.calendarDayComponent.helpers({

    getClass() {
        const instance = Template.instance();
        return instance.standalone ? 'standalone' : '';
    },

    getDay() {
        const instance = Template.instance();
        return instance.dayToDisplay.get();
    },

    getCurrentPrice() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }
        const priceObj = DayPrices.prices[instance.dayIndex.get()];
        priceObj.changed.get(); // Trigger
        return instance.eth.web3.fromWei(priceObj.price, 'ether').toString(10);
    },

    getCurrentOwner() {
        const instance = Template.instance();
        const ownerObj = DayPrices.owners[instance.dayIndex.get()];
        ownerObj.changed.get(); // Trigger
        if (Helpers.isAddressZero(ownerObj.address)) { return ''; }
        return ownerObj.name;
    },

    getColorFromAddress() {
        const instance = Template.instance();
        const ownerObj = DayPrices.owners[instance.dayIndex.get()];
        ownerObj.changed.get(); // Trigger
        return Helpers.getStylesForAddress(ownerObj.address);
    },

    hasHoliday() {
        const instance = Template.instance();
        const dayIndex = instance.dayIndex.get();
        return !_.isUndefined(_.find(HOLIDAY_ICON_MAP, {dayIndex}));
    },

    getHolidayIcon() {
        const instance = Template.instance();
        const dayIndex = instance.dayIndex.get();
        const holiday = _.find(HOLIDAY_ICON_MAP, {dayIndex}) || {};
        return holiday.img;
    },

    getHolidayTitle() {
        const instance = Template.instance();
        TAPi18n.getLanguage();
        const dayIndex = instance.dayIndex.get();
        const holiday = _.find(HOLIDAY_ICON_MAP, {dayIndex}) || {};
        return TAPi18n.__(holiday.title);
    },

    getHolidayDesc() {
        const instance = Template.instance();
        TAPi18n.getLanguage();
        const dayIndex = instance.dayIndex.get();
        const holiday = _.find(HOLIDAY_ICON_MAP, {dayIndex}) || {};
        return TAPi18n.__(holiday.desc);
    }

});
