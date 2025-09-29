/**
 * @param book
 * @returns
 */
function toBookSummary(book: { title: string; blurb: string; link: string; }): { title: any; blurb: any } {
    return {
        title: book.title,
        blurb: book.blurb
    };
}