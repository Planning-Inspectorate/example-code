const myArr = [1, 2, 5, 4];

// the sort function is a higher-order function as it accepts a function as a parameter
myArr.sort(function mySorter(a, b) {
    return a - b;
});

// arrow functions are often used here as they are short
myArr.sort((a, b) => a - b);

// map is another commonly used higher-order function
const myNewArray = myArr.map(num => num + 2);

// we may write out own higher-order functions for configurable sorting for example
// (this would be a higher-order function because it returns another function)
const myObjs = [
    {field1: 'hello', field2: 'world'},
    {field1: 'sadas', field2: '43534'}
];

// an initial implementation without higher-order functions still
// requires an arrow function to use with sort
function simpleSortByField(field: string, a: Record<string, any>, b: Record<string, any>) {
    if (a[field] > b[field]) {
        return 1;
    }
    if (a[field] < b[field]) {
        return -1;
    }
    return 0;
}
myObjs.sort((a, b) => simpleSortByField('field1', a, b));

// instead we can return a function with the signature which sort accepts
function sortByField(field: string, reverse?: boolean) {
    return (a: Record<string, any>, b: Record<string, any>) => {
        if (a[field] > b[field]) {
            return reverse ? -1 : 1;
        }
        if (a[field] < b[field]) {
            return reverse ? 1 : -1;
        }
        return 0;
    };
}

// since sortByField returns a function that accepts 'a' and 'b'
// we can pass the return value to sort directly
myObjs.sort(sortByField('field1'));
// or e.g.
myObjs.sort(sortByField('field2'));