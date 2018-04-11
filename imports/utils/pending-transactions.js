// Meteor Components
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// App Components
import { LocaleHelpers } from '/imports/utils/i18n-helpers';
import { Helpers } from '/imports/utils/common';
import { Notify } from '/imports/utils/notify';
import { log } from '/imports/utils/logging';


export const PendingTransactions = {

    transactions: [],  // {hash, claimData}
    txTracker: new Tracker.Dependency,

    getTransactionCount() {
        this.txTracker.depend();
        return this.transactions.length;
    },

    getTransactions() {
        this.txTracker.depend();
        return this.transactions;
    },

    addTransaction(contract, hash, claimData) {
        log.log('Transaction sent;', hash, claimData);
        this.transactions.push({hash, claimData});
        this.txTracker.changed();
        this.serialize();
        contract.waitForReceipt(hash, this.handleReceipt({hash, claimData}));
    },

    monitor(contract) {
        this.deserialize();
        this.txTracker.changed();
        _.forEach(this.transactions, (txData) => {
            contract.waitForReceipt(txData.hash, this.handleReceipt(txData));
        });
    },

    handleReceipt({hash, claimData}) {
        return (err, receipt) => {
            if (err) {
                log.log('Transaction failed;', err, hash, claimData);
            } else {
                log.log('Transaction succeeded;', receipt, hash, claimData);
            }

            // Transaction Complete; remove from Watch List
            _.remove(this.transactions, (tx) => tx.hash === hash);
            this.txTracker.changed();
            this.serialize();

            // Get Date being Claimed
            const {month, day} = Helpers.getMonthDayFromIndex(claimData.day);
            const date = LocaleHelpers.formatDate('MMMM Do', month, day);

            // Notify User of Transaction and Trigger Updates
            if (err) {
                Notify.warning(TAPi18n.__('modal.claim.failed', {date}), TAPi18n.__('modal.claim.errorTitle'));
                return;
            }
            Session.set('latestClaim', claimData);
            Notify.success(TAPi18n.__('modal.claim.claimed', {date}), TAPi18n.__('modal.claim.claimTitle'));
        };
    },

    serialize() {
        let forStorage = '';
        if (this.transactions.length) {
            forStorage = JSON.stringify(this.transactions);
        }
        localStorage.setItem('pendingTransactions', forStorage);
    },

    deserialize() {
        const fromStorage = localStorage.getItem('pendingTransactions');
        if (fromStorage && fromStorage.length) {
            this.transactions = JSON.parse(fromStorage);
        }
    }
};
