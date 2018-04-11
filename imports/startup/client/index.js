/**
 * Application-Wide Configurations
 */
/** @namespace process.env.NODE_ENV */
/** @namespace process.env.DEV_CONTRACT_ADDRESS */
/** @namespace process.env.PROD_CONTRACT_ADDRESS */
/** @namespace Meteor.defer */
/** @namespace Meteor.isTest */

// Meteor Components
import { FlowRouter } from 'meteor/kadira:flow-router';

// Twitter Bootstrap - Custom JS
import '/imports/startup/client/bootstrap/bootstrap';

// App Components
import './meta';
import './i18n';
import './cdn-assets';
import '/imports/utils/template-helpers';
import './routes';
import './ethereum';
import './spinner';
import { log } from '/imports/utils/logging';

import * as profanityFilter from 'profanity-filter';
import * as profanityFilterData from '/imports/utils/profanity-filters.data.json';


// Disconnect any Meteor Server
if (location.host !== 'localhost:3000' && location.host !== '127.0.0.1:3000' && typeof MochaWeb === 'undefined') {
    Meteor.disconnect();
}

//
// Client Startup - Equivalent to DOMReady event
//
Meteor.startup(function clientIndexStartup() {
    log.log('OwnTheDay Version 1.5.7');
    log.log('Check out our Ethereum Contract here: https://etherscan.io/address/0x16d790ad4e33725d44741251f100e635c323beb9#code');
    log.log('Have a great Day! 📆 🚀');
    profanityFilter.seed(profanityFilterData);
});
