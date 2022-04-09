// For one-time usage only

import { twFetch } from '../utils/fetch-helper.js';

const ENV_NAME = 'Production';
const WEBHOOK_URL = 'https://twitter-fuwa-bot.vercel.app/api/webhook';

const response = await twFetch(
    `/1.1/account_activity/all/${ENV_NAME}/webhooks.json?url=${encodeURIComponent(WEBHOOK_URL)}`,
    { method: 'POST' },
    'usercontext'
);
console.log(`${response.status} (${response.statusText})`);

const responseData = await response.json();
console.log(responseData);
