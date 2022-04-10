import { twFetch } from '../utils/fetch-helper.js';
import { AAA_WEBHOOK_ENV_NAME } from '../constants.js';

const response = await twFetch(
    `/1.1/account_activity/all/${AAA_WEBHOOK_ENV_NAME}/subscriptions.json`,
    { method: 'POST' },
    'usercontext'
);
console.log(`${response.status} (${response.statusText})`);
