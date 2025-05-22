import {PrismaClient} from '@prisma/client';

async function run() {
    const client = new PrismaClient();
    const mando = await client.user.update({
        where: {id: 1},
        data: {
            name: 'Din Djarin'
        }
    });
    console.log(mando);
}

run().catch(console.error);