// Meteor Components
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Contract } from '/imports/contract/contract-interface';
import { CurrentClaim } from '/imports/utils/current-claim';
import { PendingTransactions } from '/imports/utils/pending-transactions';
import { LocaleHelpers } from '/imports/utils/i18n-helpers';
import { Helpers } from '/imports/utils/common';
import { log } from '/imports/utils/logging';

// Template Components
import '/imports/components/loading/loading.component';
import './claim.modal.html';


Template.claimModal.onCreated(function Template_claimModal_onCreated() {
    const instance = this;
    instance.eth = MeteorEthereum.instance();
    instance.contract = Contract.instance();

    instance.loading = new ReactiveVar(false);
    instance.nextPrice = new ReactiveVar(0);

    instance.autorun(() => {
        CurrentClaim.changeTrigger.get();
        instance.loading.set(true);

        if (instance.timerId) {
            Meteor.clearTimeout(instance.timerId);
        }
        instance.timerId = Meteor.setTimeout(() => {
            instance.contract.getPriceIncrease(CurrentClaim.price)
                .then(priceIncrease => {
                    const nextPrice = priceIncrease.add(CurrentClaim.price);
                    CurrentClaim.nextPrice = nextPrice;
                    instance.nextPrice.set(nextPrice);
                    instance.loading.set(false);
                })
                .catch(log.error);
        }, 750);
    });
});

Template.claimModal.helpers({

    isLoading() {
        const instance = Template.instance();
        return instance.loading.get();
    },

    getDayIndex() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return 0; }

        // Watch for changes to Current Claim and Update Price
        CurrentClaim.changeTrigger.get();
        return CurrentClaim.day;
    },

    getCurrentPrice() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }

        // Watch for changes to Current Claim and Update Price
        CurrentClaim.changeTrigger.get();

        const price = CurrentClaim.price;
        return instance.eth.web3.fromWei(price, 'ether').toString(10);
    },

    hasCurrentOwner() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }

        // Watch for changes to Current Claim and Update Price
        CurrentClaim.changeTrigger.get();
        return !_.isEmpty(CurrentClaim.owner) && !Helpers.isAddressZero(CurrentClaim.ownerAddress);
    },

    getCurrentOwner() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }

        // Watch for changes to Current Claim and Update Owner
        CurrentClaim.changeTrigger.get();
        return CurrentClaim.owner;
    },

    getCurrentOwnerAddress() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }

        // Watch for changes to Current Claim and Update Owner
        CurrentClaim.changeTrigger.get();
        return CurrentClaim.ownerAddress;
    },

    getNextPrice() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }
        return instance.eth.web3.fromWei(instance.nextPrice.get(), 'ether').toString(10);
    },

    getColorFromAddress() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }

        // Watch for changes to Current Claim and Update Price
        CurrentClaim.changeTrigger.get();

        return Helpers.getStylesForAddress(CurrentClaim.ownerAddress);
    },

    getInfo(line) {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork) { return ''; }

        // Watch for changes to Current Claim and Update Price
        CurrentClaim.changeTrigger.get();

        const unit = TAPi18n.__('generic.etherUnit');
        const price = instance.eth.web3.fromWei(CurrentClaim.price, 'ether').toString(10);
        const nextPrice = instance.eth.web3.fromWei(CurrentClaim.nextPrice, 'ether').toString(10);

        switch (line) {
            case '1':
                const month = Session.get('selectedMonth');
                const day = Session.get('selectedDay');
                const date = LocaleHelpers.formatDate('MMMM Do', month, day);
                return TAPi18n.__('modal.claim.info.line1', {date, price: `${price} ${unit}`});
            case '2':
                return TAPi18n.__('modal.claim.info.line2', {price: `${nextPrice} ${unit}`});
            default:
                return TAPi18n.__(`modal.claim.info.line${line}`);
        }
    }

});

Template.claimModal.events({

    'click [data-action="claim-day"]' : (event, instance) => {
        const tx = {
            value : CurrentClaim.price,
            from  : instance.eth.coinbase
        };
        const latestClaim = _.omit(CurrentClaim, 'changeTrigger');
        const dayIndex = CurrentClaim.day;
        instance.contract.claimDay(dayIndex, tx)
            .then(hash => {
                PendingTransactions.addTransaction(instance.contract, hash, latestClaim);
            })
            .catch(Helpers.displayFriendlyErrorAlert);

        // Close Modal
        $('#layClaimModal').modal('hide');
    }

});

