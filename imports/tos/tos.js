// Meteor Components
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// Template Component
import '/imports/components/footer/footer.component';
import './tos.html';


Template.tos.onRendered(function Template_tos_onRendered() {
    // Set Page Title
    Meta.setSuffix(TAPi18n.__('tos.pageTitle'));
});
