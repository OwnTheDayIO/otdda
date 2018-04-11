// Meteor Components
import { _ } from 'lodash';

export class MeteorEthereum {
    constructor() {
        const component = this;
        component.isDataReady = new ReactiveVar(false);
        component.web3Browser = new ReactiveVar(false);
        component.hasValidAccount = new ReactiveVar(false);
        component.hasCorrectNetwork = new ReactiveVar(false);
        component.accountCoinbase = new ReactiveVar('');
        component.ethWeb3 = false;
    }

    static instance() {
        if (!MeteorEthereum._instance) {
            MeteorEthereum._instance = new MeteorEthereum();
        }
        return MeteorEthereum._instance;
    }

    get isReady() {
        return this.isDataReady.get();
    }

    set isReady(readyState) {
        this.isDataReady.set(readyState);
    }

    get hasWeb3Browser() {
        return this.web3Browser.get();
    }

    set hasWeb3Browser(isWeb3Browser) {
        this.web3Browser.set(isWeb3Browser);
    }

    get hasAccount() {
        return this.hasValidAccount.get();
    }

    set hasAccount(hasValidAccount) {
        this.hasValidAccount.set(hasValidAccount);
    }

    get hasNetwork() {
        return this.hasCorrectNetwork.get();
    }

    set hasNetwork(hasCorrectNetwork) {
        this.hasCorrectNetwork.set(hasCorrectNetwork);
    }

    get web3() {
        return this.ethWeb3;
    }

    set web3(ethWeb3) {
        this.ethWeb3 = ethWeb3;
    }

    get coinbase() {
        return this.accountCoinbase.get();
    }

    set coinbase(accountCoinbase) {
        this.accountCoinbase.set(accountCoinbase);
    }
}
//
// Static Member Variables
//
MeteorEthereum._instance = null; // Static Instance Member for Singleton Pattern
