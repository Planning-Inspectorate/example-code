interface BookDetails {
    title: string;
    blurb: string;
    isbn: string;
    link: string;
    price: number | string;
    published: Date;
    rating: 'Good' | 'OK' | 'Rubbish';
    starRating: 1 | 2 | 3 | 4 | 5;
    genres: string[];
    publisher: Publisher;
}

export interface Publisher {
    name: string;
    country: string;
}

interface BookSummary {
    title: string;
    blurb: string;
    published: string;
    publisherName: string;
}

/**
 * @param book
 * @returns
 */
export function toBookSummary(book: BookDetails): BookSummary {
    return {
        title: book.title,
        blurb: book.blurb,
        published: book.published.toISOString(),
        publisherName: book.publisher.name
    };
}