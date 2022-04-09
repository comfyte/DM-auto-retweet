import crypto from 'crypto';

const { OAUTH_CONSUMER_SECRET } = process.env;

/** @param {string} crcToken */
export function solveTwitterCrc(crcToken) {
    return crypto.createHmac('sha256', OAUTH_CONSUMER_SECRET).update(crcToken).digest('base64');
}

/**
 * @param {string} requestBody
 * @param {string} retrievedHash
 */
export function verifyRequestHash(requestBody, retrievedHash) {
    const calculatedHash = crypto.createHmac('sha256', OAUTH_CONSUMER_SECRET).update(requestBody).digest('base64');
    return retrievedHash === calculatedHash;
}
