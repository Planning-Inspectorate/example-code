import type { PrismaClient} from './client/client.js';
import {runDbScript} from "./run-util.ts";
import {printResults} from "../../performance-utils.ts";
import {readData} from '../common/read-data-test.ts';

async function main(client: PrismaClient) {
    const results = [];
    for (let i = 0; i < 5; i++) {
        console.log('test', i+1);
        results.push(await readData(client));
    }
    printResults(results);
}

runDbScript(main).catch(console.error);

