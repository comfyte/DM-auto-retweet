/** @param {import('@vercel/node'.VercelRequest)} requestObject */
export async function rawBody(requestObject) {
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
