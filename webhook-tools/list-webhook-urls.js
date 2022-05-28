import { twFetch } from '../utils/fetch-helper.js';

const response = await twFetch('/1.1/account_activity/all/webhooks.json', null, 'bearer');
console.log(`${response.status} (${response.statusText})`);

const responseData = await response.json();
console.log(JSON.stringify(responseData, undefined, 2));
