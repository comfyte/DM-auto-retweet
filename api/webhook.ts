import { processTwitterCrc, verifyRequestHash } from '../utils/webhook-security-check';
import { processDmForRetweeting } from '../functionalities/dm-to-retweet';
import { rawBody } from '../utils/collect-raw-body';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function twitterWebhook(req: VercelRequest, res: VercelResponse) {
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
        // Doesn't this always return true anyway?
        const success = await processDmForRetweeting(req.body);
        res.status(success ? 200 : 400).end();
    }
}
