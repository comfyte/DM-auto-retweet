import { readFile, writeFile } from 'fs/promises';

import { twFetchWithOauth1a } from './utils/api-helper.js';

const SELF_ID = '1235554825380614144';
const TIMESTAMP_FILENAME = 'last-dm-timestamp';

const lastDmTimestamp = await (async (fileName) => {
    try {
        return parseInt(await readFile(fileName, 'utf-8'));
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            const currentTimestamp = Date.now();
            await writeFile(fileName, currentTimestamp.toString());
            return currentTimestamp
        }
        else {
            throw err;
        }
    }
})(TIMESTAMP_FILENAME);

const allowedSenders = (await readFile('allowed-senders', 'utf-8')).split('\n');

try {
    // FIXME: Also account for the other property (cursor)
    const {
        events: dmData,
        next_cursor
    } = await twFetchWithOauth1a('/1.1/direct_messages/events/list.json').then((res) => res.text());

    const preparedData = dmData.filter(({ created_timestamp, type, message_create }) => (
        parseInt(created_timestamp) > lastDmTimestamp &&
        type === 'message_create' &&
        message_create.sender_id !== SELF_ID &&
        allowedSenders.includes(message_create.sender_id) &&
        message_create.message_data.entites.urls.length === 1
    ));

    console.log('List of tweets to be retweeted:');
    const tweetIds = preparedData.map((item) => {
        const tweetUrl = item.message_create.message_data.entites.urls.expanded_url;
        const [,tweetId] = tweetUrl.match(/\/status\/(\d+)/);
        console.log(tweetId);
        return tweetId;
    });
    console.log('\n');

    for (const tweetId of tweetIds) {
        const rtApiResponse = await twFetchWithOauth1a(`/2/users/${SELF_ID}/retweets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tweet_id: tweetId
            })
        });

        if (rtApiResponse.ok) {
            console.log(`Successfully retweeted tweet ID ${tweetId}`);
        }
        else {
            console.log(`Error retweeting tweet ID ${tweetId} (${rtApiResponse.status} ${rtApiResponse.statusText})`);
        }
    }

    await writeFile(TIMESTAMP_FILENAME, preparedData[0].created_timestamp);
}
catch (err) {
    throw err;
}
