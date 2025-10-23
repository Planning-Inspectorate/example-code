import {printApiResponse, printFileResponse} from "./05-promises.js";

function chaining() {
  // then can return another promise, so they don't have to be nested
  // instead of:
  printApiResponse(1)
      .then(result => {
        return printApiResponse(2)
            .then(result => console.log(result));
      });
  // we can do:
  printApiResponse(1)
      .then(result => {
        return printApiResponse(2);
      })
      .then(result => console.log(result));
}

function run() {
  // here we chain 3 promises - they happen one after another
  return printApiResponse(1)
      .then(() => printFileResponse(2))
      .then(() => printApiResponse(3))
      .catch(err => console.log('any errors', err));
}

run()
    .catch(console.error);