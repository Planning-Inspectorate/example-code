import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'schema.prisma',
	migrations: {
		path: 'migrations'
	},
    datasource: {
        url: 'sqlserver://localhost:1434;database=pins_example_code_prisma;user=sa;password=DockerDatabaseP@22word!;trustServerCertificate=true'
    }
});
