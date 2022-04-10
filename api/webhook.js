import { solveTwitterCrc, verifyRequestHash } from '../utils/webhook-security-check.js';
import { processDmForRetweeting } from '../functionalities/dm-to-retweet.js';
import { rawBody } from '../utils/collect-raw-body.js';

/**
 * @param {import('@vercel/node').VercelRequest} req 
 * @param {import('@vercel/node').VercelResponse} res 
 */
export default async function twitterWebhook(req, res) {
    console.log(`Retrieved payload: ${JSON.stringify(req.body, null, 4)}`)

    // Handle the occassional CRC check calls from twitter
    if (req.method === 'GET' && typeof req.query.crc_token === 'string') {
        const result = solveTwitterCrc(req.query.crc_token);
        res.status(200).json({ response_token: 'sha256=' + result });
        return;
    }

    // Verify the request hash first
    const [, retrievedSignature] = req.headers['x-twitter-webhooks-signature']?.match(/^sha256=(.+)$/) ?? [];
    if (!verifyRequestHash(await rawBody(req), retrievedSignature)) {
        res.status(401).end();
        return;
    }

    if (req.method === 'POST' && req.body.direct_message_events) {
        await processDmForRetweeting(req.body);
        res.status(200).end();
    }
}
