const CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const randomNumber = (range: number) => Math.floor(Math.random() * range);

export function genRandomString(length: number) {
    let result = '';

    for (let i = 0; i < length; ++i) {
        result += CHARACTER_SET.charAt(randomNumber(CHARACTER_SET.length));
    }

    return result;
}
