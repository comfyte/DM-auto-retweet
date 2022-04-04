import { SELF_ID } from '../constants.js';

/** @param {string} tweetId */
export const doRetweet = async (tweetId) => await twFetchWithOauth1a(`/2/users/${SELF_ID}/retweets`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        tweet_id: tweetId
    })
});
