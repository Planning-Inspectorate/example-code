/**
 * Returns a 'count' number of random characters from the string
 *
 * @param {string} str 
 * @param {number} count 
 * @returns {string}
 */
function randomCharacters(str, count) {
    let chars = '';
    for (let i = 0; i < count; i++) {
        const position = pseudoRandomInt(0, str.length - 1);
        // TODO: as a code editor will know the expected type of position, from the JSDoc
        // it can suggest methods and properties for that type
        // in vscode type 'position.' and it will suggest methods that numbers have.
        const char = str[position];
        // TODO: in an editor, hover over 'conact' and it will show the documentation from 
        // the concat string function, since the editor knows that 'chars' is of type string
        chars = chars.concat(char);
    }
    return chars;
};

/**
 * Generates a pseudo-random integer in the range [min, max]
 *
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function pseudoRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const chars = randomCharacters('hello', 3);
console.log(`'${chars}'`);
// TODO: code editors should show a warning for 'world' as it is not a number
const chars2 = randomCharacters('hello', 'world');
console.log(`'${chars2}'`);