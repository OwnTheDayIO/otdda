// Meteor Components
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Random } from 'meteor/random';
import * as profanityFilter from 'profanity-filter';
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Contract } from '/imports/contract/contract-interface';
import { Helpers } from '/imports/utils/common';
import { log } from '/imports/utils/logging';

// Template Components
import './nickname.modal.html';


Template.nicknameModal.onCreated(function Template_nicknameModal_onCreated() {
    const instance = this;
    instance.eth = MeteorEthereum.instance();
    instance.contract = Contract.instance();

    instance.newNickname = new ReactiveVar(Session.get('accountNickname'));

    instance.saveNickname = () => {
        const tx = {
            from : instance.eth.coinbase
        };
        const newNickname = profanityFilter.clean(instance.newNickname.get());
        instance.contract.setNickname(newNickname, tx)
            .then(hash => {
                log.log('Transaction sent;', hash);
                instance.contract.waitForReceipt(hash, function (err, receipt) {
                    if (!err) {
                        log.log('Transaction succeeded;', receipt);
                        Session.set('accountNickname', profanityFilter.clean(newNickname));
                    }
                });
            })
            .catch(Helpers.displayFriendlyErrorAlert);

        // Close Modal
        $('#setNicknameModal').modal('hide');
    };
});

Template.nicknameModal.helpers({

    getCurrentNickname() {
        const instance = Template.instance();
        if (!instance.eth.hasAccount) { return ''; }
        const nickname = Session.get('accountNickname');
        if (!nickname || !instance.eth.coinbase || _.startsWith(instance.eth.coinbase, nickname)) { return ''; }
        return Session.get('accountNickname');
    }

});

Template.nicknameModal.events({

    'input #newNickname' : (event, instance) => {
        instance.newNickname.set($(event.currentTarget).val());
    },

    'keyup #newNickname' : (event, instance) => {
        if (event.keyCode === 13) { // ENTER key
            instance.saveNickname();
        }
    },

    'click [data-action="set-nickname"]' : (event, instance) => {
        instance.saveNickname();
    }

});

