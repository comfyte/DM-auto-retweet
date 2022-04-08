import { twFetchWithUserContextAuth } from '../utils/fetch-helpers/with-user-context-auth';
import { SELF_ID } from '../constants';

export const doRetweet = async (tweetId: string) => await twFetchWithUserContextAuth(`/2/users/${SELF_ID}/retweets`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        tweet_id: tweetId
    })
});
