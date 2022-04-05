import { twFetchWithOauth1a } from '../utils/oauth1a-fetch';

export const sendDirectMessage = async (recipient_id: string, message_data: any) => await twFetchWithOauth1a(
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
    }
);

export const getDirectMessages = async () =>
    await twFetchWithOauth1a('/1.1/direct_messages/events/list.json').then((res) => res.json());
