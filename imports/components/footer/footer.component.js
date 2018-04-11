
import './footer.component.html';

Template.footerComponent.onRendered(function Template_footerComponent_onRendered() {
    Meteor.defer(() => $('[data-toggle="tooltip"]').tooltip());
});
