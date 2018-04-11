// Meteor Components
import { TAPi18n } from 'meteor/tap:i18n';
import * as profanityFilter from 'profanity-filter';
import { _ } from 'lodash';

// App Components
import { log } from '/imports/utils/logging';

// Globals
import {
    DAYS_IN_MONTH,
    ADDRESS_DISPLAY_LENGTH
} from '/imports/utils/global-constants';

// Helpers Object
export const Helpers = {};

Helpers.getValidMonthIndex = (monthIndex) => {
    let month = _.parseInt(monthIndex, 10) || 0;
    if (month < 0) { month = 11; }
    if (month > 11) { month = 0; }
    return month;
};

Helpers.getDayFromRowCol = (row, col) => (row * 7) + col + 1;

Helpers.getDayIndexRange = (month) => {
    const start = month > 0 ? _.reduce(_.dropRight(DAYS_IN_MONTH, 12-month), (sum, n) => sum + n, 0) : 0;
    const end = start + DAYS_IN_MONTH[month];
    return [start, end];
};

Helpers.getMonthDayFromIndex = (dayIndex) => {
    let month = 0;
    let day = 0;
    if (dayIndex > 0) {
        for (; month < DAYS_IN_MONTH.length; month++) {
            if (dayIndex < day + DAYS_IN_MONTH[month]) {
                day = dayIndex - day;
                break;
            }
            day += DAYS_IN_MONTH[month];
        }
    }
    return {month, day: day + 1};
};

Helpers.shortAddress = (address) => {
    if (_.isEmpty(address)) { return ''; }
    return _.toUpper(_.slice(address, address.length-6).join(''));
};

Helpers.isAddressZero = (address) => (!address || /^0$|^0x0$/i.test(address) || Helpers.shortAddress(address) === '000000');

Helpers.isInitialPrice = (price) => price.toString(10) === '1000000000000000';

Helpers.getStylesForAddress = (address, styleType = 'background') => {
    if (Helpers.isAddressZero(address)) { return ''; }
    const addressColor = Helpers.shortAddress(address);
    const textColor = Helpers.getTextColorForAddress(address);
    return `${styleType}-color:#${addressColor};color:#${textColor};`;
};

Helpers.getTextColorForAddress = (address) => {
    const addressColor = Helpers.shortAddress(address);
    const rgb = parseInt(addressColor, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >>  8) & 0xff;  // extract green
    const b = (rgb >>  0) & 0xff;  // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return (luma < 120) ? 'fff' : '333';
};

Helpers.getFriendlyOwnerName = (contract, ownerAddress) => {
    return new Promise((resolve, reject) => {
        if (!ownerAddress) { return reject('Failed to lookup nickname; invalid address supplied.'); }
        contract.getNickname(ownerAddress)
            .then(name => {
                let friendlyName = Helpers.shortAddress(ownerAddress);
                if (name.length) { friendlyName = profanityFilter.clean(name); }
                if (_.padEnd('0x', ADDRESS_DISPLAY_LENGTH, '0') === friendlyName) {
                    friendlyName = '';
                }
                resolve(friendlyName);
            })
            .catch(reject);
    });
};

Helpers.gotoAccount = (accountId) => {
    if (!_.isEmpty(accountId)) {
        Meteor.defer(() => FlowRouter.go('/account/:accountId?', {accountId}));
    }
};

Helpers.getFriendlyErrorMessage = (err) => {
    let message = '';
    log.log(err);
    if (err.message && /setTxStatusRejected/i.test(err.message)) {
        message = 'Transaction cancelled.';
    } else if (err.message && /User denied transaction signature/i.test(err.message)) {
        message = 'Transaction cancelled.';
    } else if (err.message && /setTxStatusFailed/i.test(err.message)) {
        message = 'Transaction denied by contract.';
    } else {
        message = 'Transaction failed; reason unknown, see console for error output.';
        log.log(err);
    }
    return message;
};

Helpers.displayFriendlyErrorAlert = (err) => {
    Session.set('errorAlertMessage', Helpers.getFriendlyErrorMessage(err));
    $('#errorModal').modal('show');
};

Helpers.denodeify = f => (...args) => new Promise((resolve, reject) => {
    f(...args, (err, val) => {
        if (err) {
            reject(err);
        } else {
            resolve(val);
        }
    });
});

