type NumberMap = {
    [key: string]: number;
};

/**
 * @param obj
 * @param props
 * @returns
 */
function sumProperties(obj : NumberMap, props: string[]): number {
    let sum = 0;
    for (const prop of props) {
        if (obj.hasOwnProperty(prop)) {
            sum += obj[prop];
        }
    }
    return sum;
}

sumProperties({a: 2, b: 'hello'}, ['a', 'b']);