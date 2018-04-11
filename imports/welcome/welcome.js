// Meteor Components
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';


// Template Components
import '/imports/components/quick-instructions/quick-instructions.component';
import '/imports/components/most-popular/most-popular.component';
import '/imports/components/price-level/price-level.component';
import '/imports/components/footer/footer.component';
import './welcome.html';


Template.welcome.onRendered(function Template_welcome_onRendered() {
    // Set Page Title
    Meta.setSuffix(TAPi18n.__('welcome.pageTitle'));

    Meteor.defer(() => $('[data-toggle="popover"]').popover({trigger: 'hover', placement: 'left', container: 'body'}));
});

Template.welcome.helpers({

    getCalendarRoute() {
        return FlowRouter.path('calendar');
    },

    isFromProductHunt() {
        const urlRef = FlowRouter.getQueryParam('ref') || '';
        return /producthunt/i.test(urlRef);
    }

});

