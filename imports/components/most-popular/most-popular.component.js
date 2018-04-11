// Meteor Components
import { _ } from 'lodash';

// App Components
import { DayPrices } from '/imports/utils/day-prices';

// Globals
import {
    HOLIDAY_ICON_MAP
} from '/imports/utils/global-constants';

// Template Components
import '/imports/components/loading/loading.component';
import '/imports/components/day-card/day-card.component';
import './most-popular.component.html';


Template.mostPopularDayComponent.onCreated(function Template_mostPopularDayComponent_onCreated() {
    const instance = this;
    const ranks = ['first', 'second', 'third'];

    instance.highestDayIndices = new ReactiveVar([0, 0, 0]);
    instance.autorun(() => {
        DayPrices.leaders.changed.get();
        Session.get('accountNickname');

        let highestIndices = [];
        const grouped = [];
        for (let rank = 0; rank < 3 && highestIndices.length < 3; rank++) {
            grouped.push(_.groupBy(DayPrices.leaders[ranks[rank]].days, (dayIndex) => {
                return (!_.isUndefined(_.find(HOLIDAY_ICON_MAP, ['dayIndex', dayIndex]))) ? 'holiday' : 'regular';
            }));
            if (_.get(grouped[rank], 'holiday', []).length) {
                highestIndices = _.concat(highestIndices, _.shuffle(grouped[rank].holiday));
            }
            if (highestIndices.length < 3 && _.get(grouped[rank], 'regular', []).length) {
                highestIndices = _.concat(highestIndices, _.shuffle(grouped[rank].regular));
            }
        }
        instance.highestDayIndices.set(_.take(highestIndices, 3));
    });
});

Template.mostPopularDayComponent.helpers({

    isLoaded() {
        return !DayPrices.initialLoad.get();
    },

    showLoading() {
        const tplData = Template.currentData();
        return tplData.showLoading || false;
    },

    getHighestDayIndex(rank) {
        const instance = Template.instance();
        return instance.highestDayIndices.get()[rank];
    },

    getTipPlacement() {
        const tplData = Template.currentData();
        return tplData.tipPlacement || 'right';
    }

});
