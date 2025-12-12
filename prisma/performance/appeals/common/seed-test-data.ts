// @ts-nocheck
import type { PrismaClient} from '../v7.1.0-prisma-client/client/client.ts';
import {timeDbScript} from "../../performance-utils.ts";
import {seedAppealData} from "./seed/data-test.js";

export async function seedManyAppeals(client: PrismaClient) {
	const results: Record<string, number> = {};
	results.seedAppeals = await timeDbScript(async () => await seedAppealData(client, 500));
	return results;
};
