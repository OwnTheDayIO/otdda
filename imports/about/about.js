// Meteor Components
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// Template Component
import '/imports/components/price-level/price-level.component';
import '/imports/components/footer/footer.component';
import './about.html';


Template.about.onRendered(function Template_about_onRendered() {
    // Set Page Title
    Meta.setSuffix(TAPi18n.__('about.pageTitle'));
});
