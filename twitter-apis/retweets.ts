import { twFetchWithOauth1a } from '../utils/oauth1a-fetch';
import { SELF_ID } from '../constants';

export const doRetweet = async (tweetId: string) => await twFetchWithOauth1a(`/2/users/${SELF_ID}/retweets`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        tweet_id: tweetId
    })
});
