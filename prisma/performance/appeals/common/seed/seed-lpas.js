/** @typedef {import('#utils/db-client/index.js').Prisma.LPACreateInput} LPA */

/**
 * @param {import('../client').PrismaClient} databaseConnector
 * @param {LPA[]} seed
 */
export const seedLPAs = async (databaseConnector, seed) => {
	for (const lpa of seed) {
		await databaseConnector.lPA.upsert({
			create: lpa,
			where: { lpaCode: lpa.lpaCode },
			update: lpa
		});
	}
};
