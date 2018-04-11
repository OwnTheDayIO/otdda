/* eslint-disable one-var */

// Meteor Components
import { Promise } from 'meteor/promise';
import { _ } from 'lodash';

export const cdnAssetsLoaded = new ReactiveVar(false);

const assets = {
    js : [
        'https://use.fontawesome.com/releases/v5.0.8/js/all.js'
    ],

    css : [
        // Toastr
        //  - https://github.com/CodeSeven/toastr
        {url : 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.2/toastr.min.css', insert : 'after'},

        // Twitter Bootstrap Glyphicons
        {url : 'https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css', insert : 'before'},

        // Lato + Open Sans - Google Web Font
        {url : 'https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i|Open+Sans:400,400i,700,700i', insert : 'after'}
    ]
};

Meteor.startup(() => {
    if (Meteor.isTest) {
        cdnAssetsLoaded.set(true);
        return;
    }

    const head = document.getElementsByTagName('head')[0];
    const body = document.getElementsByTagName('body')[0];
    const link = head.getElementsByTagName('link')[0];

    // Add CSS Assets
    let allCSS = _.map(assets.css, (css) => new Promise((resolve) => {
        const asset = document.createElement('link');
        asset.rel   = 'stylesheet';
        asset.type  = 'text/css';
        if (css.insert === 'before') {
            head.insertBefore(asset, link);
        } else if (link.nextSibling !== null) {
            head.insertBefore(asset, link.nextSibling);
        } else {
            head.appendChild(asset);
        }
        asset.onload = () => resolve(css);
        asset.href   = css.url;
    }));

    // Add JS Assets
    let allJS = _.map(assets.js, (js) => new Promise((resolve) => {
        const asset = document.createElement('script');
        asset.type  = 'text/javascript';
        body.appendChild(asset);
        asset.onload = () => resolve(js);
        asset.src    = js;
    }));

    // Resolve when all Assets are Loaded
    Promise.all(allCSS.concat(allJS)).then(() => {
        cdnAssetsLoaded.set(true);
    });
});
