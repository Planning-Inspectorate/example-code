import type {PrismaClient} from './generated/client.ts';
import {runDbScript} from "./run.ts";

async function run(client: PrismaClient) {
    await client.$transaction([
        client.user.update({
            where: {id: 1},
            data: {
                name: 'Din Djarin'
            }
        }),
        client.task.update({
            where: {id: 1},
            data: {done: true}
        })
    ]);
    console.log('transaction complete');
}

runDbScript(run).catch(console.error);