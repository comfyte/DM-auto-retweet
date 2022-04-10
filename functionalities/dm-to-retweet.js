import * as twApi from '../twitter-apis/index.js';
import { SELF_ID } from '../constants.js';
import allowedSenderIds from '../allowed-sender-ids.js';

/** @param {import('@vercel/node').VercelRequestBody} requestBody */
export async function processDmForRetweeting(requestBody) {
    try {
        const tweetData = requestBody.direct_message_events
            .filter(({ type, message_create }) => (
                type === 'message_create' &&
                message_create.sender_id !== SELF_ID &&
                allowedSenderIds.includes(message_create.sender_id) &&
                message_create.message_data.entities.urls.length === 1
            ))
            .map((item) => {
                const tweetUrl = item.message_create.message_data.entities.urls[0].expanded_url;
                const [, tweetId] = tweetUrl.match(/\/status\/(\d+)/);
                const senderId = item.message_create.sender_id;
                return [tweetId, senderId];
            });


        for (const [tweetId, senderId] of tweetData) {
            const rtApiResponse = await twApi.doRetweet(tweetId);

            if (rtApiResponse.ok) {
                console.log(`Successfully retweeted tweet ID ${tweetId}`);

                // Send a response to the sender
                await twApi.sendDirectMessage(senderId, {
                    text: `Retweeted tweet ${tweetId}`
                });
            }
            else {
                console.log(`Error retweeting tweet ID ${tweetId} (${rtApiResponse.status} ${rtApiResponse.statusText})`);

                // Send a failure feedback
                await twApi.sendDirectMessage(senderId, {
                    text: `Failed to retweet tweet ${tweetId} :(`
                });
            }

        }
        return true; // ?
    }
    catch (err) {
        // TODO: Handle errors properly
        throw err;
    }
}