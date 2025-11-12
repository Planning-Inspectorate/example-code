import type {Prisma, PrismaClient} from './generated/client.ts';
import type {
    DocumentCreateInput,
    TaskUpdateInput,
    UserCreateInput
} from './generated/models.ts'; // import generated types
import {runDbScript} from "./run.ts";

async function userAndTasks(client: PrismaClient) {
    // create a new user, along with two new tasks which will be associated with the user
    const newUser: UserCreateInput = {
        name: 'Mandalorian',
        email: 'mando4@starwars.com',
        displayName: 'Mando',
        Tasks: {
            create: [
                {
                    title: 'Task 1'
                },
                {
                    title: 'Task 2'
                }
            ]
        }
    };

    const user = await client.user.create({
        data: newUser,
        // when returning the user, also return the tasks count for the user
        include: {
            _count: {
                select: {
                    Tasks: true
                }
            }
        }
    });
    console.log(user);
}

async function documentAndTask(client: PrismaClient) {
    // create a new document and connect it to an existing task
    const newDocument: DocumentCreateInput = {
        filename: 'my-doc-2.pdf',
        size: 56865,
        path: 'task-1/documents/my-doc-2.pdf',
        Task: {
            connect: {id: 1}
        }
    };
    const document = await client.document.create({
        data: newDocument
    });
    console.log(document);
}

async function updateTask(client: PrismaClient) {
    // update a task, and upsert a user, which will be associated with the task
    const taskUpdate: TaskUpdateInput = {
        done: true,
        User: {
            upsert: {
                where: {id: 1},
                create: {
                    name: 'Mandalorian',
                    email: 'mando5@starwars.com',
                    displayName: 'Mando',
                },
                update: {
                    name: 'Mandalorian',
                    email: 'mando5@starwars.com',
                    displayName: 'Mando',
                }
            }
        }
    }
    await client.task.update({
        where: {id: 1},
        data: taskUpdate
    });
}

async function getUserAndRelations(client: PrismaClient) {
    // fetch a user, along with their tasks, and with those tasks' attachments
    const include: Prisma.UserInclude = {
        Tasks: {
            omit: { // omit a task field
                id: true
            },
            include: {
                Attachments: {
                    select: { // only include a subset of document fields
                        size: true,
                        filename: true,
                        path: true
                    }
                }
            }
        }
    }
    const user = await client.user.findUnique({
        where: {id: 2},
        include
    });
    console.dir(user, {depth: null});
}

runDbScript(userAndTasks).catch(console.error);

