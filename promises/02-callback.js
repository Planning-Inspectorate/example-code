function waitAWhile(cb) {
  console.log('start here');
  setTimeout(cb, 1000);
  console.log('finish here');
}

// calling waitAWhile will run the function code synchronously,
// and the 'setTimeout' call is effectively added to a background queue
waitAWhile(() => {
  console.log('  called 1');
});

waitAWhile(() => {
  console.log('  called 2');
});

// this will print
// start here
// finish here
// start here
// finish here
//   called 1
//   called 2