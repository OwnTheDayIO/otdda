// Meteor Components
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// Template Component
import '/imports/components/footer/footer.component';
import './faq.html';


Template.faq.onRendered(function Template_faq_onRendered() {
    // Set Page Title
    Meta.setSuffix(TAPi18n.__('faq.pageTitle'));

    Meteor.defer(() => $('.collapse').collapse());
});
