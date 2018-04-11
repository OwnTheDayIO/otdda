// Meteor Components
import { _ } from 'lodash';
import * as toastr from 'toastr';

const TOASTR_OPTIONS = {
    'closeButton'       : false,
    'debug'             : false,
    'newestOnTop'       : true,
    'progressBar'       : false,
    'positionClass'     : 'toast-top-center',
    'preventDuplicates' : false,
    'onclick'           : null,
    'showDuration'      : 300,
    'hideDuration'      : 1000,
    'timeOut'           : 5000,
    'extendedTimeOut'   : 1000,
    'showEasing'        : 'swing',
    'hideEasing'        : 'linear',
    'showMethod'        : 'fadeIn',
    'hideMethod'        : 'fadeOut'
};

//set default options
toastr.options = _.merge({}, TOASTR_OPTIONS);

export const Notify = {
    error   : (message, title, optionsOverride) => {
        toastr.error(message, title, _.merge({}, TOASTR_OPTIONS, optionsOverride));
    },
    info    : (message, title, optionsOverride) => {
        toastr.info(message, title, _.merge({}, TOASTR_OPTIONS, optionsOverride));
    },
    success : (message, title, optionsOverride) => {
        toastr.success(message, title, _.merge({}, TOASTR_OPTIONS, optionsOverride));
    },
    warning : (message, title, optionsOverride) => {
        toastr.warning(message, title, _.merge({}, TOASTR_OPTIONS, optionsOverride));
    },
    remove  : () => toastr.remove(),
    clear   : () => toastr.clear()
};
