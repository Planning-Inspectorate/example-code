import fs from 'node:fs';
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function readAFile(name, cb) {
  console.log('start here');
  fs.readFile(path.join(__dirname, 'files', name), (err, data) => {
    console.log('read file');
    cb(data.toString());
  });
  console.log('finish here');
}

// if we need the result of multiple callbacks, we end up nesting them
// this can get very messy and hard to follow
// also the files are then read in order, waiting for the first to complete before starting to read the second
readAFile('text-1.txt', (txt1) => {
  console.log('  read 1', txt1);
  readAFile('text-2.txt',(txt2) => {
    console.log('  read 2', txt2);
    console.log('got both files to work on...');
    // do something with txt1 and txt2
  });
});

