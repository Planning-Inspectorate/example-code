import type {PrismaClient} from './generated/client.ts';
import {runDbScript} from "./run.ts";

async function run(client: PrismaClient) {
    const mando = await client.user.create({
        data: {
            name: 'Mandalorian',
            email: 'din@djarin.com',
            displayName: 'Mando'
        }
    });
    console.log(mando);
}

runDbScript(run).catch(console.error);