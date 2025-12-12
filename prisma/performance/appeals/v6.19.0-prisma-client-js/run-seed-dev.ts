import type { PrismaClient} from './client/client.js';
import {runDbScript} from "./run-util.ts";
import {printResults} from "../../performance-utils.ts";
import {seedDevelopment} from '../common/seed/seed-development.ts';

async function main(client: PrismaClient) {
    const results = [];
    for (let i = 0; i < 3; i++) {
        console.log('test', i+1);
        results.push(await seedDevelopment(client));
    }
    printResults(results);
}

runDbScript(main).catch(console.error);

