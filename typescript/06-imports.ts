/**
 * Get a publisher by id
 *
 * @param  id
 * @returns
 */
export function getPublisher(id: number): import('./03-objects-3-typedef').Publisher {
    return {
        name: `Books 'R' Us`,
        country: 'UK'
    };
}