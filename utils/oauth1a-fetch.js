import fetch from 'node-fetch';
import crypto from 'crypto';

import { genRandomString } from './generate-random-string.js';
import { objectToUrlEncoded, urlEncodedToObject } from './url-encoding.js';

const TWITTER_API_BASE_URL = "https://api.twitter.com";
const {
    OAUTH_CONSUMER_KEY,
    OAUTH_CONSUMER_SECRET,
    OAUTH_TOKEN,
    OAUTH_TOKEN_SECRET
}= process.env;

/** @type {import('node-fetch').default} */
export async function twFetchWithOauth1a(path, options) {
    if (path.match(/\?/g)?.length > 1) {
        throw new Error();
    }

    const [url, _queryParams] = (TWITTER_API_BASE_URL + path).split('?');
    const queryParams = urlEncodedToObject(_queryParams);

    const { method, headers } = options ?? { method: 'GET' };

    if (headers?.['Content-Type'] === 'application/x-www-form-urlencoded') {
        throw new Error('Unimplemented yet!');
    }

    const oauthValues = {
        oauth_consumer_key: OAUTH_CONSUMER_KEY,
        oauth_token: OAUTH_TOKEN,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_nonce: Buffer.from(genRandomString(32)).toString('base64').replaceAll(/[^\w]/g, ''),
        oauth_version: '1.0'
    };

    const parameters = objectToUrlEncoded({
        ...queryParams,
        ...oauthValues,
    });

    const oauthSignatureBase = [method.toUpperCase(), url, parameters]
        .map((stringValue) => encodeURIComponent(stringValue))
        .join('&');


    oauthValues.oauth_signature = encodeURIComponent(crypto.createHmac('sha1', encodeURIComponent(OAUTH_CONSUMER_SECRET) + '&' + encodeURIComponent(OAUTH_TOKEN_SECRET))
        .update(oauthSignatureBase)
        .digest('base64')
    );


    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: 'OAuth ' + Object.entries(oauthValues).map(([key, value]) => `${key}="${value}"`).join(', ')
        }
    });
}
