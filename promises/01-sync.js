function aNormalFunction() {
  console.log('we start here');
  let count = 0;
  for (let i = 0; i < 3; i++) {
    count++;
    console.log(count);
  }
  console.log('we finish here');
  return count;
}

// these run one at a time as normal synchronous code
aNormalFunction();
aNormalFunction();
aNormalFunction();
aNormalFunction();