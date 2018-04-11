// Meteor Components
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { CurrentClaim } from '/imports/utils/current-claim';
import { DayPrices } from '/imports/utils/day-prices';
import { Helpers } from '/imports/utils/common';

// Globals
import {
    HOLIDAY_ICON_MAP
} from '/imports/utils/global-constants';

// Template Component
import './day-card.component.html';


Template.dayCardComponent.onCreated(function Template_dayCardComponent_onCreated(){
    const instance = this;
    instance.eth = MeteorEthereum.instance();

    instance.dayIndex = new ReactiveVar(instance.data.day);
    instance.displayOwner = new ReactiveVar(instance.data.displayOwner);

    instance.autorun(() => {
        const tplData = Template.currentData();
        Session.get('accountNickname');
        instance.dayIndex.set(tplData.day);
        instance.displayOwner.set(tplData.displayOwner);
    });
});

Template.dayCardComponent.onRendered(function Template_dayCardComponent_onRendered() {
    const instance = this;
    instance.autorun(() => {
        // Watch for changes to Language and Current Claim
        CurrentClaim.changeTrigger.get();
        TAPi18n.getLanguage();
        Meteor.defer(() => $('[data-toggle="popover"]').popover({trigger: 'hover', placement: instance.data.tipPlacement || 'right'}));
    });
});

Template.dayCardComponent.helpers({

    getDayIndex() {
        const instance = Template.instance();
        return instance.dayIndex.get();
    },

    getMonth() {
        const instance = Template.instance();
        const dayIndex = instance.dayIndex.get();
        return Helpers.getMonthDayFromIndex(dayIndex).month;
    },

    getSizeClass() {
        const tplData = Template.currentData();
        return tplData.size || 'normal';
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
        const dayIndex = instance.dayIndex.get();
        const holiday = _.find(HOLIDAY_ICON_MAP, {dayIndex}) || {};
        return TAPi18n.__(holiday.title);
    },

    getHolidayDesc() {
        const instance = Template.instance();
        const dayIndex = instance.dayIndex.get();
        const holiday = _.find(HOLIDAY_ICON_MAP, {dayIndex}) || {};
        return TAPi18n.__(holiday.desc);
    },

    getMonthClass() {
        const instance = Template.instance();
        const dayIndex = instance.dayIndex.get();
        const {month} = Helpers.getMonthDayFromIndex(dayIndex);
        return `month${month}`;
    },

    getDayLabel() {
        const instance = Template.instance();
        const dayIndex = instance.dayIndex.get();
        return Helpers.getMonthDayFromIndex(dayIndex).day;
    },

    getPrice() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }
        const priceObj = DayPrices.prices[instance.dayIndex.get()];
        priceObj.changed.get(); // Trigger
        return instance.eth.web3.fromWei(priceObj.price, 'ether').toString(10);
    },

    shouldDisplayOwner() {
        const instance = Template.instance();
        return instance.displayOwner.get();
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

});

Template.dayCardComponent.events({

    'click [data-jump]' : (event, instance) => {
        const $target = $(event.currentTarget);
        const dayIndex = $target.attr('data-jump');
        const {month, day} = Helpers.getMonthDayFromIndex(dayIndex);
        Session.set('selectedMonth', month);
        Session.set('selectedDay', day);
        Meteor.defer(() => {
            if (FlowRouter.current().route.name !== 'app.calendar') {
                FlowRouter.go('app.calendar');
            }
        });
    }

});
