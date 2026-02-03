// functions can be created in several different ways..

// function declaration
function myNormalFunc(a: number, b: number) {
    return a + b;
}
console.log('myNormalFunc', myNormalFunc(1, 2));

// function expressions
// the function name (add) is optional
const myOtherFunc = function add(a: number, b: number) {
    return a + b;
}
console.log('myOtherFunc', myOtherFunc(3, 4));

// function constructor [don't use this!]
const myConstructedFunc = new Function('a', 'b', 'return a + b;');
console.log('myConstructedFunc', myConstructedFunc(5, 6));

// arrow functions
const myArrowFunc = (a: number, b: number) => {
    return a + b;
}
console.log('myArrowFunc', myArrowFunc(7, 8));
