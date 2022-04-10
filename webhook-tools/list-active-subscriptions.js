import { twFetch } from "../utils/fetch-helper.js";
import { AAA_WEBHOOK_ENV_NAME } from '../constants.js';

const response = await twFetch(`/1.1/account_activity/all/${AAA_WEBHOOK_ENV_NAME}/subscriptions/list.json`, null, 'bearer');
console.log(`${response.status} (${response.statusText})`);

const responseData = await response.json();
console.log(responseData);

// export const subscriptionsData = responseData;
