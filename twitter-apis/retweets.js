import { twFetchWithUserContextAuth } from '../utils/fetch-helpers/with-user-context-auth.js';
import { SELF_ID } from '../constants.js';

/** @param {string} tweetId */
export const doRetweet = async (tweetId) => await twFetchWithUserContextAuth(`/2/users/${SELF_ID}/retweets`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        tweet_id: tweetId
    })
});
