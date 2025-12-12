import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'schema.prisma',
	migrations: {
		path: '../common/migrations'
	},
    datasource: {
        url: 'sqlserver://localhost:1463;database=pins_development;user=sa;password=DockerDatabaseP@22word!;trustServerCertificate=true'
    }
});
