const CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** @param {number} range */
const randomNumber = (range) => Math.floor(Math.random() * range);

/** @param {number} length */
export function genRandomString(length) {
    let result = '';

    for (let i = 0; i < length; ++i) {
        result += CHARACTER_SET.charAt(randomNumber(CHARACTER_SET.length));
    }

    return result;
}
