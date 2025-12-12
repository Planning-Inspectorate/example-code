// @ts-nocheck
import { addAssignedTeamIdToAppeal } from './add-assigned-team-id.js';
import { seedStaticData } from './data-static.js';
import { seedTestData } from './data-test.js';
import { localPlanningDepartmentList } from './LPAs/dev.js';
import { padsInspectorList } from './PADs/dev.js';
import { seedLPAs } from './seed-lpas.js';
import { seedPADSInspectors } from './seed-pads-inspectors.js';
import { seedTeams } from './seed-teams.js';
import { deleteExistingData } from './seed-truncate.js';
import { teamsToCreate } from './teams/dev.js';
import {timeDbScript} from "../../../performance-utils.ts";

export async function seedDevelopment(client: any) {
	const results: Record<string, number> = {};
	results.deleteExistingDataRun = await timeDbScript(async () => await deleteExistingData(client));
	console.info('Cleared existing records from development database\n');
	results.seedTeamsRun = await timeDbScript(async () => await seedTeams(client, teamsToCreate));
	console.info('Seeded teams into development database\n');
	results.seedLPAsRun = await timeDbScript(async () => await seedLPAs(client, localPlanningDepartmentList));
	console.info('Seeded LPAs into development database\n');
	results.seedPADSInspectorsRun = await timeDbScript(async () => await seedPADSInspectors(client, padsInspectorList));
	console.info('Seeded PADS Inspectors into development database\n');
	results.seedStaticDataRun = await timeDbScript(async () => await seedStaticData(client));
	console.info('Seeded static data into development database\n');
	results.seedTestDataRun = await timeDbScript(async () => await seedTestData(client));
	console.info('Seeded test data into development database\n');
	results.addAssignedTeamIdToAppealRun = await timeDbScript(async () => await addAssignedTeamIdToAppeal(client));
	console.info('Updated appeals with assigned team IDs\n');
	results.readAllAppeals = await timeDbScript(async () => {
		await client.appeal.findMany({
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
	})
	return results;
};
