import {callAnApi, readExampleFile} from "./utils.js";

function usingPromises() {
  // a function can return a promise, like any other value
  const promise = callAnApi();
  // promises have several methods

  // .then, which takes a function, similar to the callback pattern
  // this code is run if/when the promise resolves
  promise.then(result => {console.log(result)});

  // .catch, which takes a function
  // this code is run if/when the promise rejects
  promise.catch(err => {console.error(err)});

  // .finally, which takes a function
  // this code is run after the promise resolves or rejects
  promise.finally(() => console.log('the end'));

  // promis methods are chainable
  callAnApi()
      .then(result => {console.log(result)})
      .catch(err => {console.error(err)})
      .finally(() => console.log('the end'));
}

function run() {
  return printApiResponse(1);
}

export function printApiResponse(id) {
  console.log(id, 'start', new Date().toISOString());
  const myPromise = callAnApi();
  myPromise
      .then(timeout => {
        console.log(id, 'returned', timeout);
      });
  return myPromise;
}

const files = ['text-1.txt', 'text-2.txt', 'text-3.txt'];

export function printFileResponse(id) {
  console.log(id, 'start', new Date().toISOString());
  return readExampleFile(files[id % 3])
      .then((content) => {
        console.log(id, 'returned', content);
      });
}

run()
    .catch(console.error);