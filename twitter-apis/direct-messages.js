import { twFetch } from '../utils/fetch-helper.js';

/**
 * @param {string} recipient_id
 * @param {any} message_data
 */
export const sendDirectMessage = async (recipient_id, message_data) => await twFetch(
    '/1.1/direct_messages/events/new.json',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event: {
                type: 'message_create',
                message_create: {
                    target: { recipient_id },
                    message_data
                }
            },

        })
    },
    'usercontext'
);

export const getDirectMessages = async () =>
    await twFetchWithUserContextAuth('/1.1/direct_messages/events/list.json').then((res) => res.json());
