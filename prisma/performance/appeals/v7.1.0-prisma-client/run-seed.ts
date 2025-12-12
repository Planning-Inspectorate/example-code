import type { PrismaClient} from './client/client.js';
import {runDbScript} from "./run-util.ts";
import {printResults} from "../../performance-utils.ts";
import {seedManyAppeals} from "../common/seed-test-data.ts";

async function main(client: PrismaClient) {
    const results = [];
    for (let i = 0; i < 3; i++) {
        console.log('test', i+1);
        results.push(await seedManyAppeals(client));
    }
    printResults(results);
}

runDbScript(main).catch(console.error);

