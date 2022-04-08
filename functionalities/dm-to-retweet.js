import { readFile } from 'fs/promises';
import * as twApi from '../twitter-apis/index.js';
import { SELF_ID } from '../constants.js';

console.log(process.cwd());
const allowedSenders = (await readFile('allowed-senders-id', 'utf-8')).split('\n');

/** @param {import('@vercel/node').VercelRequestBody} requestBody */
export async function processDmForRetweeting(requestBody) {
    try {
        const tweetData = requestBody.direct_message_events
            .filter(({ type, message_create }) => (
                type === 'message_create' &&
                message_create.sender_id !== SELF_ID &&
                allowedSenders.includes(message_create.sender_id) &&
                message_create.message_data.entities.urls.length === 1
            ))
            .map((item) => {
                const tweetUrl = item.message_create.message_data.entities.urls[0].expanded_url;
                const [, tweetId] = tweetUrl.match(/\/status\/(\d+)/);
                const senderId = item.message_create.sender_id;
                console.log(`${tweetId} (by user ID ${senderId})`);
                return [tweetId, senderId];
            });


        for (const [tweetId, senderId] of tweetData) {
            const rtApiResponse = await twApi.doRetweet(tweetId);

            if (rtApiResponse.ok) {
                console.log(`Successfully retweeted tweet ID ${tweetId}`);

                // Send a response to the sender
                await twApi.sendDirectMessage(senderId, {
                    text: `Retweeted "${tweetId}"`
                });
            }
            else {
                console.log(`Error retweeting tweet ID ${tweetId} (${rtApiResponse.status} ${rtApiResponse.statusText})`);

                // Send a failure feedback
                await twApi.sendDirectMessage(senderId, {
                    text: `Failed to retweet tweet "${tweetId}" :(`
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