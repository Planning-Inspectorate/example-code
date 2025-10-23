import fs from 'node:fs/promises';
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @returns {Promise<number>}
 */
export function callAnApi() {
  const timeToWait = Math.random() * 3; // pseudo-random number 0-10
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(timeToWait);
    }, timeToWait * 1000);
  });
}

/**
 * @param {string} name
 * @returns {Promise<string>}
 */
export async function readExampleFile(name) {
  const res = await fs.readFile(path.join(__dirname, 'files', name));
  return res.toString();
}


/**
 * @returns {Promise<number>}
 */
export function callAnApiWhichFails() {
  const timeToWait = Math.random() * 3; // pseudo-random number 0-10
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(timeToWait);
    }, timeToWait * 1000);
  });
}

async function number() {
  return 5;
}