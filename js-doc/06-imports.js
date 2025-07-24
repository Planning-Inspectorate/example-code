/**
 * Get a publisher by id
 *
 * @param {number} id
 * @returns {import('./03-objects-3-typedef.js').Publisher} // import the type from another file
 */
export function getPublisher(id) {
    return {
        name: `Books 'R' Us`,
        country: 'UK'
    };
}