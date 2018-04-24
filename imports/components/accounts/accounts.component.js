// Meteor Components
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Contract } from '/imports/contract/contract-interface';
import { Helpers } from '/imports/utils/common';
import { log } from '/imports/utils/logging';

// Globals
import {
    CONTRACT_ADDRESS
} from '/imports/utils/global-constants';

// Template Component
import './accounts.component.html';


Template.accountsComponent.onCreated(function Template_accountsComponent_onCreated(){
    const instance = this;
    instance.eth = MeteorEthereum.instance();
    instance.contract = Contract.instance();

    let accountId = instance.data.accountId || instance.eth.coinbase || '';
    instance.accountId = new ReactiveVar(accountId);

    instance.friendlyName = new ReactiveVar('');
    instance.revealBalance = new ReactiveVar(false);

    // balance update interval
    const _watchBalance = (accountId) => {
        instance.updateBalanceTimer = Meteor.setTimeout(() => {
            if (!instance.eth.hasAccount) { return; }
            if (accountId !== instance.eth.coinbase) { return; }
            instance.eth.web3.eth.getBalance(accountId, (err, result) => {
                Session.set('balance', String(result));
            });
            _watchBalance(accountId);
        }, 1000);
    };

    instance.autorun(() => {
        accountId = Template.currentData().accountId || instance.eth.coinbase || '';
        instance.accountId.set(accountId);

        if (!_.isEmpty(accountId)) {
            Helpers.getFriendlyOwnerName(instance.contract, accountId)
                .then(name => instance.friendlyName.set(name))
                .catch(log.error);
        }

        if (!instance.eth.hasAccount) { return; }
        if (accountId !== instance.eth.coinbase) { return; }
        _watchBalance(accountId);
    });
});

Template.accountsComponent.onDestroyed(function Template_accountsComponent_onDestroyed() {
    const instance = this;
    if (instance.updateBalanceTimer) {
        Meteor.clearInterval(instance.updateBalanceTimer);
    }
});

Template.accountsComponent.events({

    'click [data-action="toggle-balance"]' : (event, instance) => {
        instance.revealBalance.set(!instance.revealBalance.get());
    }

});

Template.accountsComponent.helpers({

    isCurrentUser() {
        const instance = Template.instance();
        return instance.accountId.get() === instance.eth.coinbase;
    },

    getAddress() {
        const instance = Template.instance();
        return instance.accountId.get();
    },

    getFriendlyName() {
        const instance = Template.instance();
        return instance.friendlyName.get();
    },

    isBalanceVisible() {
        const instance = Template.instance();
        return instance.revealBalance.get();
    },

    getBalance() {
        const instance = Template.instance();
        if (!instance.eth.hasNetwork || !instance.revealBalance.get()) { return ''; }
        return instance.eth.web3.fromWei(Session.get('balance'), 'ether').toString(10);
    },

    getTokenAddress() {
        const instance = Template.instance();
        const accountId = instance.accountId.get();
        const contractAddress = CONTRACT_ADDRESS[instance.eth.networkVersion];
        return `https://etherscan.io/token/${contractAddress}?a=${accountId}`;
    }
});
