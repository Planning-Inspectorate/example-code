/**
 * @param {{title: string, blurb: string, link: string}} book
 * @returns {{title: string, blurb: string}}
 */
function toBookSummary(book) {
    return {
        title: book.title,
        blurb: book.blurb
    };
}