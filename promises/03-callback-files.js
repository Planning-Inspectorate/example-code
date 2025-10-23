import fs from 'node:fs';
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// a more realistic example reading a file, which is asynchronous
// the callback is run after the file is read
function readAFile(name, cb) {
  console.log('start here');
  fs.readFile(path.join(__dirname, 'files', name), (err, data) => {
    console.log('read file');
    cb(data.toString());
  });
  console.log('finish here');
}

readAFile('text-1.txt', (data) => {
  console.log('  read 1', data);
});

readAFile('text-2.txt',(data) => {
  console.log('  read 2', data);
});





