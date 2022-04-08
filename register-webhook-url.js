// For one-time usage only

import { twFetchWithUserContextAuth } from './utils/fetch-helpers/with-user-context-auth';

const ENV_NAME = '';
const WEBHOOK_URL = 'https://twitter-fuwa-bot.vercel.app/api/webhook';

const response = await twFetchWithUserContextAuth(
    `https://api.twitter.com/1.1/account_activity/all/${ENV_NAME}/webhooks.json?url=${encodeURIComponent(WEBHOOK_URL)}`
);