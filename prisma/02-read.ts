import type {PrismaClient} from './generated/client.ts';
import {runDbScript} from "./run.ts";

async function run(client: PrismaClient) {
    const mando = await client.user.findUnique({
        where: {id: 1}
    });
    console.log(mando);
}

runDbScript(run).catch(console.error);