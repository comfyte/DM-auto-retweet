import { processTwitterCrc, verifyRequestHash } from '../utils/webhook-security-check.js';
import { processDmForRetweeting } from '../functionalities/dm-to-retweet.js';
import { rawBody } from '../utils/collect-raw-body.js';

/**
 * @param {import('@vercel/node').VercelRequest} req 
 * @param {import('@vercel/node').VercelResponse} res 
 */
export default async function twitterWebhook(req, res) {
    // Handle the occassional CRC check calls from twitter
    if (req.method === 'GET' && typeof req.query.crc_token === 'string') {
        const result = processTwitterCrc(req.query.crc_token);
        res.status(200).send(result);
        return;
    }

    // Verify the request hash first
    if (
        typeof req.headers['x-twitter-webhooks-signature'] === 'string' &&
        !verifyRequestHash(await rawBody(req.body), req.headers['x-twitter-webhooks-signature'])
    ) {
        res.status(401).end();
        return;
    }

    if (req.method === 'POST' && req.body.direct_message_events) {
        // if (allowedSenders.includes(req.body.dm.blablabla?)) { [???]
        await processDmForRetweeting(req.body);
        res.status(200).end();
    }
}
