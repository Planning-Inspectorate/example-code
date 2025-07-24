/**
 * @typedef {Object<string, number>} NumberMap
 */

/**
 * @param {NumberMap} obj 
 * @param {string[]} props 
 * @returns {number}
 */
function sumProperties(obj, props) {
    let sum = 0;
    for (const prop of props) {
        if (obj.hasOwnProperty(prop)) {
            sum += obj[prop];
        }
    }
    return sum;
}

sumProperties({a: 2, b: 'hello'}, ['a', 'b']);