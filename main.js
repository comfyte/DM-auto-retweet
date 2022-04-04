import { readFile, writeFile } from 'fs/promises';
import * as twApi from './api-helpers';
import { TIMESTAMP_FILENAME } from './constants.js';

const lastDmTimestamp = await (async (fileName) => {
    try {
        return parseInt(await readFile(fileName, 'utf-8'));
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            const currentTimestamp = Date.now();
            await writeFile(fileName, currentTimestamp.toString());
            return currentTimestamp;
        }
        else {
            throw err;
        }
    }
})(TIMESTAMP_FILENAME);

const allowedSenders = (await readFile('allowed-senders', 'utf-8')).split('\n');

try {
    // Do we need to also account for the next_cursor if we're periodically checking it anyway?
    const { events: dmData } = await twApi.getDirectMessages();

    const preparedData = dmData.filter(({ created_timestamp, type, message_create }) => (
        parseInt(created_timestamp) > lastDmTimestamp &&
        type === 'message_create' &&
        message_create.sender_id !== SELF_ID &&
        allowedSenders.includes(message_create.sender_id) &&
        message_create.message_data.entities.urls.length === 1
    ));

    console.log('List of tweets to be retweeted:');
    const tweetIds = preparedData.map((item) => {
        const tweetUrl = item.message_create.message_data.entities.urls[0].expanded_url;
        const [,tweetId] = tweetUrl.match(/\/status\/(\d+)/);
        const senderId = item.message_create.sender_id;
        console.log(`${tweetId} (by user ID ${senderId})`);
        return [tweetId, senderId];
    });
    console.log('\n');

    for (const [tweetId, senderId] of tweetIds) {
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

    if (preparedData.length) {
        await writeFile(TIMESTAMP_FILENAME, preparedData[0].created_timestamp);
    }
}
catch (err) {
    // TODO: Handle errors properly
    throw err;
}
