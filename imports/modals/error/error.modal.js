// Meteor Components
import { _ } from 'lodash';

// Template Components
import './error.modal.html';

Template.errorModal.helpers({

    getErrorMessage() {
        return Session.get('errorAlertMessage');
    }

});

