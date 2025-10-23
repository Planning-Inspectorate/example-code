import {printApiResponse, printFileResponse} from "./05-promises.js";
import {callAnApiWhichFails} from "./utils.js";

function run() {
  // we can start several promises in succession, then wait for them all to return
  return Promise.all([
    printApiResponse(1),
    printFileResponse(2),
    printApiResponse(3)
  ])
      .then(result => {
        console.log(result); // an array of the promise return values, in the order they were passed to Promise.all
      });
}

function race() {
  // you can also fire off several promises, and return just the fastest one
  // note that the other promises are not cancelled and may still be running in the background
  return Promise.race([
    printApiResponse(1),
    printFileResponse(2),
    printApiResponse(3)
  ])
      .then(result => {
        console.log(result); // the first promise result to return
      });
}

function settled() {
  // allSettled waits for all promises to complete, whether rejecting or resolving
  // the value returned is the status of each promise
  return Promise.allSettled([
    printApiResponse(1),
    printFileResponse(2),
    printApiResponse(3),
    callAnApiWhichFails()
  ])
      .then(result => {
        for (const r of result) {
          console.log(r.status, r.value);
        }
      });
}

run()
    .catch(console.error);