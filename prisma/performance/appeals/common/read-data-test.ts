// @ts-nocheck
import type { PrismaClient} from '../v7.1.0-prisma-client/client/client.ts';
import {timeDbScript} from "../../performance-utils.ts";

export async function readData(client: PrismaClient) {
	const results: Record<string, number> = {};
	results.readOneAppealAndRelations = await timeDbScript(async () => {
		const res = await client.appeal.findUnique({
			where: {
				id: 10000
			},
			include: {
				appealTimetable: true,
				appealStatus: true,
				appealType: true,
				procedureType: true,
				address: true,
				neighbouringSites: true,
				lpa: true,
				specialisms: true,
				allocation: true,
				appellant: true,
				agent: true,
				caseOfficer: true,
				inspector: true,
				padsInspector: true,
				appellantCase: true,
				lpaQuestionnaire: true,
				siteVisit: true,
				inspectorDecision: true,
				folders: true,
				documents: true,
				auditTrail: true,
				parentAppeals: true,
				childAppeals: true,
				representations: true,
				caseNotes: true,
				hearing: true,
				appealNotifications: true,
				hearingEstimate: true,
				inquiry: true,
				inquiryEstimate: true,
				assignedTeam: true,
				appealRule6Parties: true,
				appealGrounds: true
			}
		})
		console.log('  appeal keys', Object.keys(res || {}).length);
	})
	results.readAllAppeals = await timeDbScript(async () => {
		const res = await client.appeal.findMany({});
		console.log('  appeals', res.length);
	});
	results.readAllLpas = await timeDbScript(async () => {
		const res = await client.lPA.findMany({});
		console.log('  lpas', res.length);
	});
	results.readAllAddresses = await timeDbScript(async () => {
		const res = await client.address.findMany();
		console.log('  addresses', res.length);
	});
	results.readAllFolders = await timeDbScript(async () => {
		const res = await client.folder.findMany();
		console.log('  folders', res.length);
	});
	results.findAppeal = await timeDbScript(async () => {
		const res = await client.appeal.findMany({
			where: {
				appealType: {
					key: 'W'
				}
			}
		});
		console.log('  W appeals', res.length);
	});
	results.readAllAppealsAndRelations = await timeDbScript(async () => {
		const res = await client.appeal.findMany({
			include: {
				appealTimetable: true,
				appealStatus: true,
				appealType: true,
				procedureType: true,
				address: true,
				neighbouringSites: true,
				lpa: true,
				specialisms: true,
				allocation: true,
				appellant: true,
				agent: true,
				caseOfficer: true,
				inspector: true,
				padsInspector: true,
				appellantCase: true,
				lpaQuestionnaire: true,
				siteVisit: true,
				inspectorDecision: true,
				folders: true,
				documents: true,
				auditTrail: true,
				parentAppeals: true,
				childAppeals: true,
				representations: true,
				caseNotes: true,
				hearing: true,
				appealNotifications: true,
				hearingEstimate: true,
				inquiry: true,
				inquiryEstimate: true,
				assignedTeam: true,
				appealRule6Parties: true,
				appealGrounds: true
			}
		})
		console.log('  appeals', res.length);
	})
	return results;
};
