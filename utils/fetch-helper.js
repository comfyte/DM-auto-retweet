import fetch from 'node-fetch';
import crypto from 'crypto';
import { genRandomString } from './generate-random-string.js';
import { objectToUrlEncoded, urlEncodedToObject } from './url-encoding.js';
import { TWITTER_API_BASE_URL } from '../constants.js';

// Required environment variables for auth
const {
    OAUTH_BEARER_TOKEN,
    OAUTH_CONSUMER_KEY,
    OAUTH_CONSUMER_SECRET,
    OAUTH_TOKEN,
    OAUTH_TOKEN_SECRET
} = process.env;

function checkEnvExistence(...variables) {
    for (const variable of variables) {
        if (!variable) {
            throw new ReferenceError('One or more of the required OAuth environment variable(s) are missing!');
        }
    }
    return true;
}

/**
 * @param {string} path
 * @param {RequestInit} options
 * @param {'usercontext' | 'bearer'} authenticationType
 * @returns {Promise<Response>}
 */
export const twFetch = async (path, options, authenticationType) => {
    const requestUrl = TWITTER_API_BASE_URL + path;
    const { method, headers } = options ?? { method: 'GET' };

    const authorizationHeaderValue = ((authType) => {
        switch (authType) {
            case 'bearer':
                checkEnvExistence(OAUTH_BEARER_TOKEN);
                return `Bearer ${OAUTH_BEARER_TOKEN}`;

            case 'usercontext':
                // Check first if those required env variables actually exist/provided
                checkEnvExistence(OAUTH_CONSUMER_KEY, OAUTH_CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET);

                if (path.match(/\?/g)?.length > 1) {
                    throw new Error();
                }
                const [requestBaseUrl, _queryParams] = requestUrl.split('?');
                const queryParams = urlEncodedToObject(_queryParams);

                if (headers?.['Content-Type'] === 'application/x-www-form-urlencoded') {
                    throw new Error('Unimplemented yet!');
                }

                const oauthValues = {
                    oauth_consumer_key: OAUTH_CONSUMER_KEY,
                    oauth_token: OAUTH_TOKEN,
                    oauth_signature_method: 'HMAC-SHA1',
                    oauth_timestamp: Math.floor(Date.now() / 1000),
                    oauth_nonce: Buffer.from(genRandomString(32)).toString('base64').replace(/[^\w]/g, ''),
                    oauth_version: '1.0'
                };

                const parameters = objectToUrlEncoded({
                    ...queryParams,
                    ...oauthValues,
                });

                const oauthSignatureBase = [method.toUpperCase(), requestBaseUrl, parameters]
                    .map((stringValue) => encodeURIComponent(stringValue))
                    .join('&');

                oauthValues.oauth_signature = encodeURIComponent(crypto.createHmac('sha1', encodeURIComponent(OAUTH_CONSUMER_SECRET) + '&' + encodeURIComponent(OAUTH_TOKEN_SECRET))
                    .update(oauthSignatureBase)
                    .digest('base64')
                );

                return 'OAuth ' + Object.entries(oauthValues).map(([key, value]) => `${key}="${value}"`).join(', ');

            default:
                throw new Error('Auth type not supplied or is not supported yet!');
        }
    })(authenticationType);

    return fetch(requestUrl, {
        ...options,
        headers: {
            ...headers,
            Authorization: authorizationHeaderValue
        }
    });
}
