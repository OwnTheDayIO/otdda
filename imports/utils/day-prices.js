
export const  DayPrices = {
    initialLoad : new ReactiveVar(true),
    prices      : [],
    owners      : [],
    nameCache   : {},

    leaders : {
        first: {
            price: 0,
            days: []
        },
        second: {
            price: 0,
            days: []
        },
        third: {
            price: 0,
            days: []
        },

        mostDays: [],

        monthDominators: [],
        monthDomLeaders: [],

        changed: new ReactiveVar('')
    }
};
