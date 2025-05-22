import {PrismaClient} from '@prisma/client';

async function run() {
    const client = new PrismaClient();

    // first create some tasks, using upsert (create or update) so this can be run multiple times
    for (let i = 0; i < 10; i++) {
        const task = {
            id: i,
            title: `Task ${i}`,
            done: false,
            userId: 1
        };
        await client.task.upsert({
            where: {id: i},
            create: task,
            update: task
        })
    }

    // then list them all
    const tasks = await client.task.findMany({});
    console.log(tasks);
}

run().catch(console.error);