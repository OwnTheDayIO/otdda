// Meteor Components
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { _ } from 'lodash';

// Primary Page Layout
import '/imports/layouts/body/body';

// Route Pages
import '/imports/404/notfound';
import '/imports/welcome/welcome';
import '/imports/calendar/calendar';
import '/imports/account/account';
import '/imports/about/about';
import '/imports/faq/faq';
import '/imports/tos/tos';

const _scrollToTop = () => $(window).scrollTop(0);

// Route Group
const publicRoutes = FlowRouter.group({
    triggersEnter: [_scrollToTop]
});

//
// System Routes
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//

// 404 - Not Found
FlowRouter.notFound = {
    action() {
        BlazeLayout.render('bodyLayout', { main: 'notfound', componentData: {} });
    }
};

//
// Group Routes
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//

// Welcome
//  - Displays Welcome Page
publicRoutes.route('/', {
    name: 'app.welcome',
    action() {
        BlazeLayout.render('bodyLayout', { main: 'welcome', componentData: {} });
    }
});

// Calendar
publicRoutes.route('/calendar', {
    name: 'app.calendar',
    action() {
        BlazeLayout.render('bodyLayout', { main: 'calendar', componentData: {} });
    }
});

// Account
publicRoutes.route('/account/:accountId?', {
    name: 'app.account',
    action() {
        BlazeLayout.render('bodyLayout', { main: 'account', componentData: {} });
    }
});

// About
publicRoutes.route('/about', {
    name: 'app.about',
    action() {
        BlazeLayout.render('bodyLayout', { main: 'about', componentData: {} });
    }
});

// FAQ
publicRoutes.route('/faq', {
    name: 'app.faq',
    action() {
        BlazeLayout.render('bodyLayout', { main: 'faq', componentData: {} });
    }
});

// TOS
publicRoutes.route('/terms', {
    name: 'app.terms',
    action() {
        BlazeLayout.render('bodyLayout', { main: 'tos', componentData: {} });
    }
});
