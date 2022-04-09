/** @param {import('@vercel/node'.VercelRequest)} requestObj */
export async function rawBody(requestObj) {
    let chunks = [];

    requestObj.on('error', () => {
        throw new Error();
    })

    requestObj.on('data', (chunk) => {
        chunks.push(chunk);
    });

    const finalRawBody = await new Promise<string>((resolve) => {
        requestObj.on('end', () => {
            const result = Buffer.concat(chunks).toString('utf-8');
            resolve(result);
        });
    });

    return finalRawBody;
}
