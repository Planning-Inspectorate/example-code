import {PrismaClient} from '@prisma/client';

async function run() {
    const client = new PrismaClient();
    const mando = await client.user.create({
        data: {
            id: 1,
            name: 'Mandalorian',
            email: 'din@djarin.com',
            displayName: 'Mando'
        }
    });
    console.log(mando);
}

run().catch(console.error);