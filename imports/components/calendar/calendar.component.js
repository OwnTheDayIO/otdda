// Meteor Components
import { Random } from 'meteor/random';
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Contract } from '/imports/contract/contract-interface';
import { Helpers } from '/imports/utils/common';
import { DayPrices } from '/imports/utils/day-prices';

// Globals
import {
    DAYS_IN_MONTH
} from '/imports/utils/global-constants';

// Template Component
import '/imports/components/loading/loading.component';
import '/imports/components/calendar-day/calendar-day.component';
import './calendar.component.html';


Template.calendarComponent.onCreated(function Template_calendarComponent_onCreated() {
    const instance = this;
    instance.eth = MeteorEthereum.instance();
    instance.contract = Contract.instance();

    instance.dayIndexRange = [0, 31];
    instance.selectedDayIndex = 0;

    // Watch changes to Calendar Month
    instance.autorun(() => {
        // Triggers
        const selectedMonth = Session.get('selectedMonth');
        DayPrices.leaders.changed.get();

        // Ensure Valid Day Selected
        let day;
        Tracker.nonreactive(() => { day = Session.get('selectedDay'); });
        day = _.clamp(day, 1, DAYS_IN_MONTH[selectedMonth]);
        Session.set('selectedDay', day);

        // Get Day-Index Range for Selected Month
        instance.dayIndexRange = Helpers.getDayIndexRange(selectedMonth);
    });
});

Template.calendarComponent.onRendered(function Template_calendarComponent_onRendered() {
    const instance = this;
    instance.autorun(() => {
        const selectedMonth = Session.get('selectedMonth');
        Meteor.setTimeout(() => {
            const $popovers = $('.calendar-day-icon[data-toggle="popover"]');
            $popovers.popover('destroy');
            $popovers.popover({
                trigger: 'hover',
                viewport: '#calendarViewport',
                container: 'body'
            })
        }, 500);
    });
});

Template.calendarComponent.helpers({

    isLoaded() {
        return !DayPrices.initialLoad.get();
    },

    getCalendarRows() {
        return _.times(5);
    },

    getCalendarColumns() {
        return _.times(7);
    },

    isValidDay(row, column) {
        const day = Helpers.getDayFromRowCol(row, column);
        return day <= DAYS_IN_MONTH[Session.get('selectedMonth')];
    },

    getCalendarDay(row, column) {
        return Helpers.getDayFromRowCol(row, column);
    },

    getSelectedCellClass(row, column) {
        const day = Helpers.getDayFromRowCol(row, column);
        return Session.get('selectedDay') === day ? 'active' : '';
    },

    getCalendarDayData(row, column) {
        const day = Helpers.getDayFromRowCol(row, column);
        const maxDays = DAYS_IN_MONTH[Session.get('selectedMonth')];
        return {
            day : day <= maxDays ? day : false,
            month : Session.get('selectedMonth')
        };
    },

    hasMonthDominator() {
        const selectedMonth = Session.get('selectedMonth');
        DayPrices.leaders.changed.get();
        const dominator = DayPrices.leaders.monthDominators[selectedMonth] || {};
        return !_.isUndefined(dominator.owner);
    },

    getDominatorAddress() {
        const selectedMonth = Session.get('selectedMonth');
        DayPrices.leaders.changed.get();
        const dominator = DayPrices.leaders.monthDominators[selectedMonth] || {};
        if (_.isUndefined(dominator.owner)) { return ''; }
        return dominator.owner;
    },

    getDominatorNickname() {
        const selectedMonth = Session.get('selectedMonth');
        DayPrices.leaders.changed.get();
        const dominator = DayPrices.leaders.monthDominators[selectedMonth] || {};
        const ownerObj = _.find(DayPrices.owners, {address: dominator.owner}) || {};
        ownerObj.changed.get();
        return ownerObj.name || '';
    },

    getColorFromAddress() {
        const selectedMonth = Session.get('selectedMonth');
        DayPrices.leaders.changed.get();
        const dominator = DayPrices.leaders.monthDominators[selectedMonth] || {};
        if (_.isUndefined(dominator.owner)) { return ''; }
        return Helpers.getStylesForAddress(dominator.owner);
    },

});

Template.calendarComponent.events({

    'click [data-select-month]' : (event, instance) => {
        const $target = $(event.currentTarget);
        let month = $target.attr('data-select-month');
        if (/prev/i.test(month)) {
            month = Helpers.getValidMonthIndex(Session.get('selectedMonth') - 1);
        }
        else if (/next/i.test(month)) {
            month = Helpers.getValidMonthIndex(Session.get('selectedMonth') + 1);
        } else {
            month = Helpers.getValidMonthIndex(month);
        }
        Session.set('selectedMonth', month);
    },

    'click [data-select-cell]' : (event, instance) => {
        const $target = $(event.currentTarget);
        let day = _.parseInt($target.attr('data-select-cell'), 10) || 0;
        day = _.clamp(day, 1, DAYS_IN_MONTH[Session.get('selectedMonth')]);
        Session.set('selectedDay', day);
    }

});
