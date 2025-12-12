/** @typedef {import('#utils/db-client/index.js').Prisma.PADSUserCreateInput} PADSUser */

/**
 * @param {import('../client').PrismaClient} databaseConnector
 * @param {PADSUser[]} seed
 */
export const seedPADSInspectors = async (databaseConnector, seed) => {
	for (const padUser of seed) {
		await databaseConnector.pADSUser.upsert({
			create: padUser,
			where: { sapId: padUser.sapId },
			update: padUser
		});
	}
};
