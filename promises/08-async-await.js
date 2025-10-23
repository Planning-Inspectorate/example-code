import {callAnApi, readExampleFile} from "./utils.js";

// adding the `async` keyword to a function means it will return a Promise
// even if no Promise is created. This function does not need to be async!
async function number() {
  return 5;
}

// when we have an async function we can use the `await` syntax to wait for promises to resolve
async function run() {
  // these happen one at a time, and the code only continues execution after each promise has resolved
  const res1 = await printApiResponse(1);
  const res2 = await printApiResponse(2);
  console.log('results', [res1, res2]);

  // you can mix await and .then, await will wait for the whole promise chain to complete
  // generally though it is confusing to mix the syntaxes! so use one or the other
  await printApiResponse(3)
      .then(value => console.log('this is done', value))
      .then(value => printApiResponse(1));
  console.log('all done');
}

async function printApiResponse(id) {
  console.log(id, 'start', new Date().toISOString());
  try {
    // when await is used, we can use standard try/catch blocks to handle errors
    const timeout = await callAnApi();
    console.log(id, 'returned', timeout);
    console.log('finish');
    return timeout;
  } catch (error) {
    console.log(error.message);
  }
}

run().catch(err => console.log(err));