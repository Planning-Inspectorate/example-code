import {PrismaClient} from '@prisma/client';

async function run() {
    const client = new PrismaClient();
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

run().catch(console.error);