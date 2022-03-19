export function urlEncodedToObject(encodedString) {
    const result = {};
    const iterator = new URLSearchParams(encodedString).entries();
    // It's supposedly already decoded, apparently
    for (const [key, value] of iterator) {
        result[key] = value;
    }
    return result;
}

export function objectToUrlEncoded(obj) {
    return Object.entries(obj)
        .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
        .sort() // Just sort it anyway
        .join('&');
}
