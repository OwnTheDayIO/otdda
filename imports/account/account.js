// Meteor Components
import { _ } from 'lodash';

// Template Component
import '/imports/components/accounts/accounts.component';
import '/imports/components/my-days/my-days.component';
import '/imports/components/account-warning/account-warning.component';
import './account.html';

Template.account.onRendered(function Template_account_onRendered() {
    // Set Page Title
    Meta.setSuffix(TAPi18n.__('account.pageTitle'));
});

Template.account.helpers({

    getAccountId() {
        return FlowRouter.getParam('accountId') || false;
    }

});
