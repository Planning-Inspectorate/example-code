import {PrismaMssql} from "@prisma/adapter-mssql";
import {PrismaClient} from './client/index.js';

export async function runDbScript(run: (client: PrismaClient) => Promise<void>) {
    const client = newDatabaseClient();
    await run(client);
    await client.$disconnect();
}

function newDatabaseClient(): PrismaClient {
    const adapter = new PrismaMssql('sqlserver://localhost:1463;database=pins_development;user=sa;password=DockerDatabaseP@22word!;trustServerCertificate=true');
    return new PrismaClient({adapter});
}

