// Meteor Components
import { _ } from 'lodash';

// App components
import { MeteorEthereum } from '/imports/utils/meteor-ethereum';
import { Helpers } from '/imports/utils/common';
import { log } from '/imports/utils/logging';

// Globals
import {
    CONTRACT_ADDRESS_DEV,
    CONTRACT_ADDRESS_PRD,
    RECEIPT_WATCH_INTERVAL
} from '/imports/utils/global-constants';

// Contract Application-Binary-Interface
const _ABI = [{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdrawAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dayIndex","type":"uint256"}],"name":"claimDay","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_price","type":"uint256"}],"name":"assignInitialDays","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_price","type":"uint256"}],"name":"calculateOwnerCut","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"isMigrationFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"approvedFor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"dayIndexToPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nickname","type":"string"}],"name":"setAccountNickname","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"tokensOf","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_dayIndex","type":"uint256"}],"name":"getPriceByDayIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ownedTokensIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finishMigration","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"_symbol","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenApprovals","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"takeOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"ownedTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_price","type":"uint256"}],"name":"calculatePriceIncrease","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerAddressToName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_dayIndex","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_price","type":"uint256"}],"name":"Bought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_dayIndex","type":"uint256"},{"indexed":true,"name":"_owner","type":"address"},{"indexed":false,"name":"_price","type":"uint256"}],"name":"Sold","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":false,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"}];


export class Contract {
    constructor() {
        this.eth = MeteorEthereum.instance();
        this.contract = null;
    }

    static instance() {
        if (!Contract._instance) {
            Contract._instance = new Contract();
        }
        return Contract._instance;
    }

    connectToContract() {
        let address = CONTRACT_ADDRESS_DEV;
        if (/production/i.test(process.env.NODE_ENV)) {
            address = CONTRACT_ADDRESS_PRD;
        }
        this.contract = this.eth.web3.eth.contract(_ABI, address).at(address);
    }

    getNickname(ownerAddress) {
        if (!this.eth.hasNetwork) { return Promise.reject('Provider not ready'); }
        const _accountName = Helpers.denodeify(this.contract.ownerAddressToName);
        return _accountName(ownerAddress);
    }

    setNickname(nickname, tx) {
        if (!this.eth.hasNetwork) { return Promise.reject('Provider not ready'); }
        const _setAccountNickname = Helpers.denodeify(this.contract.setAccountNickname);
        let promise;
        try {
            promise = _setAccountNickname(nickname, tx);
        } catch (err) {
            log.error(err);
            promise = Promise.reject(err);
        }
        return promise;
    }

    getDayPrice(dayIndex) {
        if (!this.eth.hasNetwork) { return Promise.reject('Provider not ready'); }
        const _dayPrice = Helpers.denodeify(this.contract.getPriceByDayIndex);
        return _dayPrice(dayIndex);
    }

    getDayOwner(dayIndex) {
        if (!this.eth.hasNetwork) { return Promise.reject('Provider not ready'); }
        const _dayOwner = Helpers.denodeify(this.contract.ownerOf);
        return _dayOwner(dayIndex);
    }

    getPriceIncrease(currentPrice) {
        if (!this.eth.hasNetwork) { return Promise.reject('Provider not ready'); }
        const _calculatePriceIncrease = Helpers.denodeify(this.contract.calculatePriceIncrease);
        return _calculatePriceIncrease(currentPrice);
    }

    claimDay(bithdayIndex, tx) {
        if (!this.eth.hasNetwork) { return Promise.reject('Provider not ready'); }
        const _claimDay = Helpers.denodeify(this.contract.claimDay);
        let promise;
        try {
            promise = _claimDay(bithdayIndex, tx);
        } catch (err) {
            promise = Promise.reject(err);
        }
        return promise;
    }

    waitForReceipt(hash, cb) {
        const self = this;
        const _getTransactionReceipt = Helpers.denodeify(this.eth.web3.eth.getTransactionReceipt);
        _getTransactionReceipt(hash)
            .then(receipt => {
                if (receipt !== null) {
                    // Transaction went through
                    if (cb) {
                        cb(null, receipt);
                    }
                } else {
                    // Try again in 1 second
                    window.setTimeout(function () {
                        self.waitForReceipt(hash, cb);
                    }, RECEIPT_WATCH_INTERVAL);
                }
            })
            .catch(err => {
                log.error(err);
                cb(err);
            });
    }
}
//
// Static Member Variables
//
Contract._instance = null; // Static Instance Member for Singleton Pattern
