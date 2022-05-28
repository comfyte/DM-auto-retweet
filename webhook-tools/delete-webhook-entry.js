// For one-time usage only

import { twFetch } from '../utils/fetch-helper.js';
import { AAA_WEBHOOK_ENV_NAME } from '../constants.js';

const { WEBHOOK_ID } = process.env;

const response = await twFetch(
    `/1.1/account_activity/all/${AAA_WEBHOOK_ENV_NAME}/webhooks/${WEBHOOK_ID}.json`,
    { method: 'DELETE' },
    'usercontext'
);
console.log(`${response.status} (${response.statusText})`);
