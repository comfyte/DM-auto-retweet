import crypto from 'crypto';

const { OAUTH_CONSUMER_SECRET } = process.env;

export function processTwitterCrc(crcToken: string) {
    return crypto.createHmac('sha256', OAUTH_CONSUMER_SECRET).update(crcToken).digest('base64');
}

export function verifyRequestHash(requestBody: string, retrievedHash: string) {
    const calculatedHash = crypto.createHmac('sha256', OAUTH_CONSUMER_SECRET).update(requestBody).digest('base64');
    return retrievedHash === calculatedHash;
}
