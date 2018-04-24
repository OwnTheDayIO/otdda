// Meteor Components
//import { Web3 } from 'meteor/ethereum:web3';
import { _ } from 'lodash';

// App Components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Contract } from '/imports/contract/contract-interface';
import { log } from '/imports/utils/logging';

function _loadWeb3() {
    const eth = MeteorEthereum.instance();
    const contract = Contract.instance();
    let web3Injected = window.web3;

    if (!_.isUndefined(web3Injected)) {
        log.log('Using Injected Web3 Provider');
        eth.web3 = new Web3(web3Injected.currentProvider);
    // } else {
    //     log.log('No Web3 detected, using HTTP Provider');
    //     eth.web3 = new Web3('https://mainnet.infura.io/');
    }
    if (!_.isObject(eth.web3)) {
        eth.isReady = true;
        return;
    }

    eth.hasWeb3Browser = !_.isUndefined(web3Injected);
    eth.hasAccount = !_.isEmpty(eth.web3.eth.coinbase);

    eth.web3.version.getNetwork((err, networkVersion) => {
        eth.isReady = true;

        // Check for Valid Network Version
        //   Main    = 1
        //   Ropsten = 3
        //   Rinkeby = 4
        //   Kovan   = 42
        //   Ganache = 5777 (local)
        if (process.env.NODE_ENV === 'development') {
            if (networkVersion === '1') { return; }
        } else {
            if (networkVersion !== '1') { return; }
        }

        // Network Active; Connect to Contract
        eth.hasNetwork = true;
        eth.networkVersion = networkVersion;
        contract.connectToContract(eth.networkVersion);
    });
}
window.addEventListener('load', _loadWeb3);
