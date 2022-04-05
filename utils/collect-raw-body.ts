import type { VercelRequest } from '@vercel/node';

export async function rawBody(requestObject: VercelRequest) {
    let chunks = [];


    requestObject.on('data', (chunk) => {
        chunks.push(chunk);
    });

    const finalRawBody = await new Promise<string>((resolve) => {
        requestObject.on('end', () => {
            const result = Buffer.concat(chunks).toString('utf-8');
            resolve(result)
        });
    });

    return finalRawBody;
}
