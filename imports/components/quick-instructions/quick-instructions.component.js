// Meteor Components
import { TAPi18n } from 'meteor/tap:i18n';
import { _ } from 'lodash';

// Template Components
import './quick-instructions.component.html';

Template.quickInstructionsComponent.helpers({

    getLine(line) {
        const mmbeLink = `<a href="https://metamask.io/" target="_blank">${TAPi18n.__('component.quickInstructions.metamask')}</a>`;
        const ethLink = `<a href="https://ethereum.org/" target="_blank">${TAPi18n.__('component.quickInstructions.ethereum')}</a>`;
        const coinbase = '<a href="https://www.coinbase.com/" target="_blank">Coinbase.com</a>';
        return TAPi18n.__(`component.quickInstructions.line${line}`, {mmbeLink, ethLink, coinbase});
    }

});

