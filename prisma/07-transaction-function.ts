import type {PrismaClient} from './generated/client.ts';
import {runDbScript} from "./run.ts";

async function run(client: PrismaClient) {
    await client.$transaction(async ($tx) => {
        const task = await $tx.task.findUnique({where: {id: 1}});
        if (!task) {
            throw new Error('task not found');
        }

        // if this task is edited while this transaction is in progress, it'll be re-run with the latest data, and no
        // changes from the first run would be applied
        // this is not a particularly good/realistic example of transaction usage - there are better ways to show "(done)" after the task title!
        if (task.done) {
            if (!task.title.includes('(done)')) {
                await $tx.task.update({where: {id: 1}, data: {title: task.title + ' (done)'}});
            }
        } else {
            await $tx.task.update({where: {id: 1}, data: {title: task.title.replace(' (done)', '')}});
        }
    });
    console.log('transaction complete');
    const task = await client.task.findUnique({where: {id: 1}})
    console.log(task);
}

runDbScript(run).catch(console.error);