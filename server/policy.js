// Meteor Components
import { BrowserPolicy } from 'meteor/browser-policy-common';

Meteor.startup(() => {
    BrowserPolicy.framing.disallow();

    //BrowserPolicy.content.disallowInlineScripts(); // prevents bootstrap scripts from working
    BrowserPolicy.content.allowInlineStyles();
    //BrowserPolicy.content.allowEval(); // for now, this is breaking something in meteor...
    BrowserPolicy.content.disallowConnect();

    //BrowserPolicy.content.allowOriginForAll('https://mainnet.infura.io/');
    BrowserPolicy.content.allowOriginForAll('https://*.google-analytics.com');
    BrowserPolicy.content.allowOriginForAll('https://*.googleapis.com');
    BrowserPolicy.content.allowOriginForAll('https://*.gstatic.com');
    BrowserPolicy.content.allowOriginForAll('https://*.bootstrapcdn.com');
    BrowserPolicy.content.allowOriginForAll('https://*.maxcdn.com');
    BrowserPolicy.content.allowOriginForAll('https://*.cloudflare.com');
    BrowserPolicy.content.allowOriginForAll('https://*.cloudfront.net');
    BrowserPolicy.content.allowOriginForAll('https://*.jsdelivr.net');
    BrowserPolicy.content.allowOriginForAll('https://*.fontawesome.com');
    BrowserPolicy.content.allowOriginForAll('https://*.cryptocompare.com');

    // IN-1345; Manager-App Migration
    try {
        /* istanbul ignore else */
        if (process.env.NODE_ENV === 'development') {
            BrowserPolicy.content.allowFrameOrigin('http://localhost:3000');

            // Required to get Coverage Report working
            BrowserPolicy.content.allowScriptOrigin('http://localhost:3100');
            BrowserPolicy.content.allowScriptOrigin('http://localhost:3200');

            // TestRPC
            BrowserPolicy.content.allowOriginForAll('http://localhost:7545');
            BrowserPolicy.content.allowOriginForAll('http://127.0.0.1:7545');
        }
    } catch (err) {}

    // Allow Fonts loaded from "data:" sources
    BrowserPolicy.content.allowFontOrigin('data:');
    var constructedCsp = BrowserPolicy.content._constructCsp();
    BrowserPolicy.content.setPolicy(`${constructedCsp} font-src data:;`);

    // The disallowConnect statement will prevent us from using Meteor's DDP connection,
    // so we should also add the following rules:
    var rootUrl = __meteor_runtime_config__.ROOT_URL;
    BrowserPolicy.content.allowConnectOrigin(rootUrl);
    BrowserPolicy.content.allowConnectOrigin(rootUrl.replace('http', 'ws'));
    BrowserPolicy.content.allowConnectOrigin(rootUrl.replace('http', 'wss'));
});
