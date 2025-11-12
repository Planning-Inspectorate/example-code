import {PrismaMssql} from "@prisma/adapter-mssql";
import {PrismaClient} from './generated/client.ts';

export async function runDbScript(run: (client: PrismaClient) => Promise<void>) {
    const client = newDatabaseClient();
    await run(client);
    await client.$disconnect();
}

function newDatabaseClient(): PrismaClient {
    const adapter = new PrismaMssql('sqlserver://localhost:1434;database=pins_example_code_prisma;user=sa;password=DockerDatabaseP@22word!;trustServerCertificate=true');
    return new PrismaClient({adapter});
}

