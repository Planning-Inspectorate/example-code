/**
 * @typedef {Object} BookDetails
 * @property {string} title
 * @property {string} blurb
 * @property {string} isbn
 * @property {string} link
 * @property {number|string} price
 * @property {Date} published
 * @property {'Good' | 'OK' | 'Rubbish'} rating
 * @property {1 | 2 | 3 | 4 | 5} starRating
 * @property {string[]} genres
 * @property {Publisher} publisher
 */

/**
 * @typedef {Object} Publisher
 * @property {string} name
 * @property {string} country
 */

/**
 * @typedef {Object} BookSummary
 * @property {string} title
 * @property {string} blurb
 * @property {string} published
 * @property {string} publisherName
 */

/**
 * @param {BookDetails} book
 * @returns {BookSummary}
 */
export function toBookSummary(book) {
    return {
        title: book.title,
        blurb: book.blurb,
        published: book.published.toISOString(),
        publisherName: book.publisher.name
    };
}

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