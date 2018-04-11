/*eslint no-console: "off"*/

import { _ } from 'lodash';

export class log {
    static log(msg, ...args) {
        console.log(msg, ...args);
    }
    static info(msg, ...args) {
        console.info(msg, ...args);
    }
    static warn(msg, ...args) {
        console.warn(msg, ...args);
    }
    static error(msg, ...args) {
        console.error(msg, ...args);
    }
}
