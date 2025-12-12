/**
 * Test data used for development and testing
 */
import {calculateTimetable} from '../util/business-days.js';
import {randomUUID} from 'node:crypto';
import {
	addressesList,
	addressListForTrainers,
	agentsList,
	appellantsList,
	createLPAQuestionnaireForAppealType,
	getRandomisedAppellantCaseCreateInput
} from './data-samples.js';
import {localPlanningDepartmentList} from './LPAs/dev.js';

import {createAppealReference} from '../util/appeal-reference.js';
import {APPEAL_REPRESENTATION_TYPE, ODW_SYSTEM_ID} from '../util/common.js';
import {FOLDERS} from '../util/documents.js';
import {AUDIT_TRAIL_SYSTEM_UUID, CASE_RELATIONSHIP_LINKED, CASE_RELATIONSHIP_RELATED} from '../util/support.js';
import {
	APPEAL_ALLOCATION_LEVEL,
	APPEAL_APPELLANT_PROCEDURE_PREFERENCE,
	APPEAL_CASE_STATUS,
	APPEAL_CASE_TYPE
} from '../util/data-model-enums.js';
import {sub} from 'date-fns';

import isExpeditedAppealType from '../util/is-expedited-appeal-type.js';
import {randomBool, randomEnumValue} from './data-utilities.js';

/** @typedef {import('@pins/appeals.api').Appeals.AppealSite} AppealSite */

/**
 * @param {Duration} duration
 * @returns {Date} date two weeks ago
 */
function getPastDate(duration) {
	return sub(new Date(), duration);
}

/**
 *
 * @param {object[] | string[]} list
 * @returns {number}
 */
const pickRandom = (list) => Math.floor(Math.random() * list.length);

/**
 * @returns {string}
 */
function generateLpaReference() {
	const numberPrefix = Math.floor(Math.random() * 69_999 + 1);
	const numberSuffix = Math.floor(Math.random() * 699_999 + 1);
	const date = pickRandom(['2020', '2021', '2022', '2023']);

	return `${numberPrefix}/APP/${date}/${numberSuffix}`;
}

/**
 * assigned allocation levels have an associated band - see appealAllocationLevels in config.js
 * @param {string} level
 */
function allocationBandLookup(level) {
	if ([APPEAL_ALLOCATION_LEVEL.A, APPEAL_ALLOCATION_LEVEL.B].includes(level.toLocaleUpperCase()))
		return 3;
	if ([APPEAL_ALLOCATION_LEVEL.C, APPEAL_ALLOCATION_LEVEL.D].includes(level.toLocaleUpperCase()))
		return 2;
	return 1;
}

/**
 *
 * @param {{
 * 	typeShorthand: string,
 * 	status?: import('#db-client').Prisma.AppealStatusCreateWithoutAppealInput,
 *  lpaQuestionnaire?: boolean,
 *  startedAt?: Date | null,
 *  validAt?: Date | null,
 *  siteAddressList?: AppealSite[],
 *  assignCaseOfficer: boolean,
 *  agent?: boolean }} param0
 * @returns {import('#db-client').Prisma.AppealCreateInput}
 */
const appealFactory = ({
	typeShorthand,
	status = {},
	lpaQuestionnaire = false,
	startedAt = null,
	validAt = null,
	siteAddressList = addressesList,
	assignCaseOfficer = false,
	agent = true
}) => {
	const appellantInput = appellantsList[pickRandom(appellantsList)];
	const agentInput = agentsList[pickRandom(agentsList)];
	const lpaInput = localPlanningDepartmentList[pickRandom(localPlanningDepartmentList)];
	const randomAddress = siteAddressList[pickRandom(siteAddressList)];
	const formattedAddress = {
		addressLine1: randomAddress.addressLine1,
		addressLine2: randomAddress.addressLine2 || null,
		addressCounty: randomAddress.county || null,
		addressTown: randomAddress.town || null,
		postcode: randomAddress.postCode,
		addressCountry: null
	};
	//allocation is nullable
	const allocation = randomEnumValue(APPEAL_ALLOCATION_LEVEL);
	const appealTypeKey = typeShorthand || randomEnumValue(APPEAL_CASE_TYPE, false);

	let procedureKey;

	if (appealTypeKey === APPEAL_CASE_TYPE.W) {
		procedureKey = randomEnumValue(APPEAL_APPELLANT_PROCEDURE_PREFERENCE, false);
	} else if (appealTypeKey === APPEAL_CASE_TYPE.Y) {
		procedureKey = randomEnumValue(
			{
				HEARING: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.HEARING,
				WRITTEN: APPEAL_APPELLANT_PROCEDURE_PREFERENCE.WRITTEN
			},
			false
		);
	} else {
		procedureKey = APPEAL_APPELLANT_PROCEDURE_PREFERENCE.WRITTEN;
	}

	return {
		...(appealTypeKey && {
			appealType: {connect: {key: appealTypeKey}}
		}),
		...(procedureKey && {
			procedureType: {connect: {key: procedureKey}}
		}),
		caseStartedDate: startedAt,
		caseValidDate: validAt,
		reference: randomUUID(),
		appealStatus: {create: status},
		appellantCase: {create: getRandomisedAppellantCaseCreateInput(typeShorthand)},
		appellant: {
			create: appellantInput
		},
		...(agent && {
			agent: {
				create: agentInput
			}
		}),
		lpa: {
			connectOrCreate: {
				where: {lpaCode: lpaInput.lpaCode},
				create: lpaInput
			}
		},
		applicationReference: generateLpaReference(),
		address: {create: formattedAddress},
		...(assignCaseOfficer && {
			caseOfficer: {
				connectOrCreate: {
					where: {azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID},
					create: {azureAdUserId: AUDIT_TRAIL_SYSTEM_UUID}
				}
			}
		}),
		...(lpaQuestionnaire && {
			lpaQuestionnaire: {create: createLPAQuestionnaireForAppealType(typeShorthand)}
		}),
		...(allocation && {
			allocation: {create: {level: allocation, band: allocationBandLookup(allocation)}}
		}),
		folders: {
			createMany: {
				data: FOLDERS.map(p => ({path: p}))
			}
		}
	};
};

const newAppeals = [
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.D, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.D, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.D, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.D, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		assignCaseOfficer: true
	})
];

// S78
const newS78Appeals = [
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.W, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 2 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 1 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ weeks: 3 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ weeks: 4 }) },
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 5 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 4 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ weeks: 7 }),
		validAt: getPastDate({ months: 4 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 4 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 2 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 4 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 1 }),
		validAt: getPastDate({ months: 3 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 12 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 4 }),
		validAt: getPastDate({ months: 5 }),
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 10 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 8 }),
		validAt: getPastDate({ months: 9 }),
		assignCaseOfficer: false,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 5 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 1 }),
		validAt: getPastDate({ months: 5 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 7 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 3 }),
		validAt: getPastDate({ months: 5 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 8 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 7 }),
		validAt: getPastDate({ months: 8 }),
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.W,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 10 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 6 }),
		validAt: getPastDate({ months: 10 }),
		assignCaseOfficer: false,
		agent: true
	})
];

const newS20Appeals = [
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.Y, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: false,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 10 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 6 }),
		validAt: getPastDate({ months: 10 }),
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 10 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 6 }),
		validAt: getPastDate({ months: 10 }),
		assignCaseOfficer: false,
		agent: true
	})
];

const newCasPlanningAppeals = [
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.ZP, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: false,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.STATEMENTS, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 10 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 6 }),
		validAt: getPastDate({ months: 10 }),
		assignCaseOfficer: false,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZP,
		status: { status: APPEAL_CASE_STATUS.FINAL_COMMENTS, createdAt: getPastDate({ months: 10 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 6 }),
		validAt: getPastDate({ months: 10 }),
		assignCaseOfficer: false,
		agent: true
	})
];

const newCasAdvertAppeals = [
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.ZA, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: false,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: { status: APPEAL_CASE_STATUS.INVALID, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.ZA,
		status: {
			status: APPEAL_CASE_STATUS.ISSUE_DETERMINATION,
			createdAt: getPastDate({ months: 6 })
		},
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	})
];

const newAdvertAppeals = [
	appealFactory({ typeShorthand: APPEAL_CASE_TYPE.H, assignCaseOfficer: false }),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: { status: APPEAL_CASE_STATUS.VALIDATION, createdAt: getPastDate({ days: 5 }) },
		lpaQuestionnaire: true,
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: false
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: { status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: false,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: { status: APPEAL_CASE_STATUS.INVALID, createdAt: getPastDate({ months: 6 }) },
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.H,
		status: {
			status: APPEAL_CASE_STATUS.ISSUE_DETERMINATION,
			createdAt: getPastDate({ months: 6 })
		},
		lpaQuestionnaire: true,
		startedAt: getPastDate({ months: 2 }),
		validAt: getPastDate({ months: 6 }),
		assignCaseOfficer: true,
		agent: true
	})
];

// HAS
const appealsLpaQuestionnaireDue = [
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 6 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 6 }),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 5 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 5 }),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 3 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 3 }),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 3 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 3 }),
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 2 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 2 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 2 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 2 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 2 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 2 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 2 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 2 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 1 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 1 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 1 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 1 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE,
			createdAt: getPastDate({ weeks: 1 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 1 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	})
];

// HAS
const appealsReadyToStart = [
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.READY_TO_START,
			createdAt: getPastDate({ weeks: 3 })
		},
		lpaQuestionnaire: false,
		startedAt: null,
		validAt: getPastDate({ weeks: 3 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.READY_TO_START,
			createdAt: getPastDate({ weeks: 3 })
		},
		lpaQuestionnaire: false,
		startedAt: null,
		validAt: getPastDate({ weeks: 3 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.READY_TO_START,
			createdAt: getPastDate({ weeks: 2 })
		},
		lpaQuestionnaire: false,
		startedAt: null,
		validAt: getPastDate({ weeks: 2 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.READY_TO_START,
			createdAt: getPastDate({ weeks: 2 })
		},
		lpaQuestionnaire: false,
		startedAt: null,
		validAt: getPastDate({ weeks: 2 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.READY_TO_START,
			createdAt: getPastDate({ weeks: 1 })
		},
		lpaQuestionnaire: false,
		startedAt: null,
		validAt: getPastDate({ weeks: 1 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	})
];

const appealsReadyToIssueDecision = [
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.D,
		status: {
			status: APPEAL_CASE_STATUS.ISSUE_DETERMINATION,
			createdAt: getPastDate({ weeks: 3 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 1 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.Y,
		status: {
			status: APPEAL_CASE_STATUS.ISSUE_DETERMINATION,
			createdAt: getPastDate({ weeks: 3 })
		},
		lpaQuestionnaire: true,
		startedAt: new Date(),
		validAt: getPastDate({ weeks: 1 }),
		siteAddressList: addressListForTrainers,
		assignCaseOfficer: true
	})
];

export const enforcementAppeals = [
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.C,
		assignCaseOfficer: false,
		status: {
			status: APPEAL_CASE_STATUS.VALIDATION,
			createdAt: getPastDate({ days: 5 })
		}
	}),
	appealFactory({
		typeShorthand: APPEAL_CASE_TYPE.C,
		assignCaseOfficer: false,
		status: {
			status: APPEAL_CASE_STATUS.VALIDATION,
			createdAt: getPastDate({ weeks: 1 })
		}
	})
];

const appealsData = [
	...appealsReadyToStart,
	...newAppeals,
	...appealsLpaQuestionnaireDue,
	...newS78Appeals,
	...newS20Appeals,
	...newCasPlanningAppeals,
	...newCasAdvertAppeals,
	...newAdvertAppeals,
	...appealsReadyToIssueDecision,
	...enforcementAppeals
];

/**
 * @param {import('#db-client').PrismaClient} client
 */
export async function seedTestData(client) {
	const appeals = [];

	for (const appealData of appealsData) {
		const appeal = await client.appeal.create({ data: appealData });
		const defaultFolders = FOLDERS.map((/** @type {string} */ path) => {
			return {
				caseId: appeal.id,
				path
			};
		});

		await client.folder.createMany({ data: defaultFolders });
		const appealWithReference = await client.appeal.update({
			where: {
				id: appeal.id
			},
			data: {
				reference: createAppealReference(appeal.id)
			}
		});
		appeals.push(appealWithReference);
	}

	const lpaQuestionnaires = await client.lPAQuestionnaire.findMany();
	const lpaNotificationMethods = await client.lPANotificationMethods.findMany();
	const designatedSites = await client.designatedSite.findMany();

	for (const lpaQuestionnaire of lpaQuestionnaires) {
		await client.listedBuildingSelected.createMany({
			data: ['1021469', '1021470', '1021472', '1021473'].map((listEntry, index) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				listEntry,
				affectsListedBuilding: index > 1
			}))
		});

		await client.lPANotificationMethodsSelected.createMany({
			data: [1, 2].map((item) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				notificationMethodId: lpaNotificationMethods[item].id
			}))
		});

		await client.designatedSiteSelected.createMany({
			data: [1, 2].map((item) => ({
				lpaQuestionnaireId: lpaQuestionnaire.id,
				designatedSiteId: designatedSites[item].id
			}))
		});
	}

	const appealWithNeighbouringSitesId = appeals[10].id;

	const randomAddress = addressesList[pickRandom(addressesList)];
	const formattedAddress = {
		addressLine1: randomAddress.addressLine1,
		addressLine2: randomAddress.addressLine2 || null,
		addressCounty: randomAddress.county || null,
		addressTown: randomAddress.town || undefined,
		postcode: randomAddress.postCode
	};

	await addSite(
		client,
		appealWithNeighbouringSitesId,
		'back-office',
		formattedAddress
	);
	await addSite(
		client, appealWithNeighbouringSitesId, 'lpa', formattedAddress);
	const linkedAppeals = [
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: appeals[1].reference,
			childId: appeals[1].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: appeals[2].reference,
			childId: appeals[2].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[0].reference,
			parentId: appeals[0].id,
			childRef: appeals[16].reference,
			childId: appeals[16].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[4].reference,
			parentId: appeals[4].id,
			childRef: appeals[19].reference,
			childId: appeals[19].id,
			type: CASE_RELATIONSHIP_LINKED
		},
		{
			parentRef: appeals[4].reference,
			parentId: appeals[4].id,
			childRef: appeals[20].reference,
			childId: appeals[20].id,
			type: CASE_RELATIONSHIP_LINKED
		}
	];

	const relatedAppeals = [
		{
			parentRef: appeals[11].reference,
			parentId: appeals[11].id,
			childRef: appeals[12].reference,
			childId: appeals[12].id,
			type: CASE_RELATIONSHIP_RELATED
		},
		{
			parentRef: appeals[12].reference,
			parentId: appeals[12].id,
			childRef: appeals[13].reference,
			childId: appeals[13].id,
			type: CASE_RELATIONSHIP_RELATED
		}
	];

	await client.appealRelationship.createMany({
		data: [...linkedAppeals, ...relatedAppeals]
	});

	const appealTypes = await client.appealType.findMany();
	const appealStatus = await client.appealStatus.findMany();
	const siteVisitType = await client.siteVisitType.findMany();

	const counters = {
		finalComment: 0,
		statements: 0,
		proofOfEvidence: 0
	};

	for (const { appealTypeId, id, caseStartedDate, lpaId, appellantId } of appeals) {
		const appealType =
			appealTypes.filter(({ id }) => id === appealTypeId)[0].key || APPEAL_CASE_TYPE.D;

		if (caseStartedDate) {
			const appealTimetable = await calculateTimetable(appealType, caseStartedDate);

			await client.appealTimetable.create({
				data: {
					appealId: id,
					...appealTimetable
				}
			});
		}

		//REPS
		if (!isExpeditedAppealType(appealType)) {
			await client.representation.create({
				data: {
					appeal: {
						connect: {
							id
						}
					},
					representationType: APPEAL_REPRESENTATION_TYPE.APPELLANT_STATEMENT,
					originalRepresentation: `Statement from appellant`,
					represented: {
						create: appellantsList[pickRandom(appellantsList)]
					}
				},
				include: {
					represented: true
				}
			});

			await addStatements(client, id, lpaId, counters);
			await addFinalComments(client, id, appellantId || 0, lpaId, counters);
			await addProofOfEvidence(client, id, appellantId || 0, lpaId, counters);
		}

		const statusWithSiteVisitSet = appealStatus.find(
			({ appealId, status, valid }) =>
				appealId === id &&
				valid &&
				[APPEAL_CASE_STATUS.ISSUE_DETERMINATION, APPEAL_CASE_STATUS.COMPLETE].includes(status)
		);

		const today = new Date();

		if (statusWithSiteVisitSet) {
			await client.siteVisit.create({
				data: {
					appealId: id,
					visitDate: today,
					visitEndTime: `${today.toISOString().split('T')[0]}T16:00:00.000Z`,
					visitStartTime: `${today.toISOString().split('T')[0]}T14:00:00.000Z`,
					siteVisitTypeId: siteVisitType[pickRandom(siteVisitType)].id
				}
			});
		}
	}

	const appellantCases = await client.appellantCase.findMany();

	const knowledgeOfOtherLandowners = await client.knowledgeOfOtherLandowners.findMany({
		where: {
			name: 'Some'
		}
	});

	const validationOutcomes = await client.appellantCaseValidationOutcome.findMany({
		orderBy: {
			name: 'asc'
		}
	});

	const appellantCaseIncompleteReasons =
		await client.appellantCaseIncompleteReason.findMany();

	const appellantCaseInvalidReasons = await client.appellantCaseInvalidReason.findMany();

	const appellantCaseValidationOutcomes = [
		{
			validationOutcomeId: validationOutcomes[0].id,
			incompleteReasons: appellantCaseIncompleteReasons.map(({ id }) => id)
		},
		{
			validationOutcomeId: validationOutcomes[1].id,
			invalidReasons: appellantCaseInvalidReasons.map(({ id }) => id)
		},
		{
			validationOutcomeId: validationOutcomes[2].id
		}
	];

	for (const appellantCase of appellantCases) {
		const status = appealStatus.find(({ appealId }) => appealId === appellantCase.appealId);
		const validationOutcome =
			status?.status !== APPEAL_CASE_STATUS.VALIDATION &&
			status?.status !== APPEAL_CASE_STATUS.READY_TO_START &&
			status?.status !== APPEAL_CASE_STATUS.ASSIGN_CASE_OFFICER
				? appellantCaseValidationOutcomes[2]
				: null;

		const planningObligation = randomBool();
		const statusPlanningObligation = planningObligation
			? randomBool()
				? 'finalised'
				: 'not_started' // TODO (A2-173): replace with data model constants once those are available
			: null;

		await client.appellantCase.update({
			where: { id: appellantCase.id },
			data: {
				hasAdvertisedAppeal: true,
				knowsOtherOwnersId: knowledgeOfOtherLandowners[0].id,
				...(validationOutcome && {
					appellantCaseValidationOutcomeId: validationOutcome.validationOutcomeId
				}),
				planningObligation,
				statusPlanningObligation
			}
		});

		if (validationOutcome?.incompleteReasons) {
			await client.appellantCaseIncompleteReasonsSelected.createMany({
				data: validationOutcome?.incompleteReasons.map((item) => ({
					appellantCaseIncompleteReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
			await client.appeal.update({
				where: { id: appellantCase.appealId },
				data: { caseExtensionDate: new Date() }
			});
		}

		if (validationOutcome?.invalidReasons) {
			await client.appellantCaseInvalidReasonsSelected.createMany({
				data: validationOutcome?.invalidReasons.map((item) => ({
					appellantCaseInvalidReasonId: item,
					appellantCaseId: appellantCase.id
				}))
			});
		}
	}

	// enforcement appeals
	const enforcementAppealTypeId = appealTypes.find(
		(appealType) => appealType.key === APPEAL_CASE_TYPE.C
	)?.id;
	const enforcementAppellantCaseId = appeals.find(
		(appeal) => appeal.appealTypeId === enforcementAppealTypeId
	)?.id;
	const contactAddress = addressesList[pickRandom(addressesList)];
	const formattedContactAddress = {
		addressLine1: contactAddress.addressLine1,
		addressLine2: contactAddress.addressLine2 || null,
		addressCounty: contactAddress.county || null,
		addressTown: contactAddress.town || undefined,
		postcode: contactAddress.postCode
	};
	await client.$transaction(async (tx) => {
		const address = await tx.address.create({ data: formattedContactAddress });
		await tx.appellantCase.update({
			where: { appealId: enforcementAppellantCaseId },
			data: {
				contactAddressId: address.id,
				enforcementNoticeListedBuilding: false,
				enforcementIssueDate: getPastDate({ days: 10 }),
				enforcementEffectiveDate: new Date(),
				contactPlanningInspectorateDate: getPastDate({ days: 10 }),
				enforcementReference: 'Reference',
				interestInLand: 'Land owner',
				writtenOrVerbalPermission: 'Written',
				descriptionOfAllegedBreach: 'Description'
			}
		});
	});
}

export async function seedAppealData(client, count = null) {
	let appealsToSeed = [
		...appealsData
	];

	if (count) {
		const batches = Math.ceil(count / appealsData.length);
		for (let i = 0; i < batches; i++) {
			appealsToSeed.push(...appealsData);
		}
		console.log('total appeals', appealsToSeed.length);
	}

	// let idx = 0;
	// let time = performance.now();
	let batch = [];

	for (const appealData of appealsToSeed) {
		// idx++;
		// if (idx % 100 === 0) {
		// 	const elapsed = performance.now() - time;
		// 	time = performance.now();
		// 	console.log(idx, elapsed);
		// }
		async function create() {
			const appeal = await client.appeal.create({data: appealData});
			const appealWithReference = await client.appeal.update({
				where: {
					id: appeal.id
				},
				data: {
					reference: createAppealReference(appeal.id)
				}
			});
		}

		batch.push(create());
		if (batch.length > 50) {
			await Promise.all(batch);
			batch = [];
		}
	}
	await Promise.all(batch);
}

/**
 * @param {import('#db-client').PrismaClient} client
 * @param {number} id
 * @param {number} lpaId
 * @param {Object<string, number>} counters
 */
async function addStatements(client, id, lpaId, counters) {
	switch (counters.statements) {
		case 1:
			await addIPComments(client, id);
			break;
		case 2:
			await addLpaStatement(client, id, lpaId);
			break;
		case 3:
			await addIPComments(client, id);
			await addLpaStatement(client, id, lpaId);
			break;
		default:
			break;
	}

	if (counters.statements > 2) {
		counters.statements = 0;
	} else {
		counters.statements++;
	}
}

/**
 * @param {import('#db-client').PrismaClient} client
 * @param {number} id
 */
async function addIPComments(client, id) {
	const formatSourceMap = {
		[ODW_SYSTEM_ID]: 'Back Office',
		citizen: 'Front Office'
	};
	const originalRepresentation =
		'I love cheese, especially cottage cheese queso. Ricotta monterey jack emmental cheese and biscuits jarlsberg manchego roquefort babybel. Chalk and cheese cut the cheese cream cheese croque monsieur cheese strings blue castello halloumi say cheese.';

	const rejectionReason = await client.representationRejectionReason.findFirst();
	for (let ii in appellantsList) {
		const represented = appellantsList[ii];
		const source = Number(ii) % 2 ? 'citizen' : ODW_SYSTEM_ID;
		const hasEmail = !!(Number(ii) % 3);
		const status = getRandomReviewStatus();

		const repRecord = await client.representation.create({
			data: {
				appeal: {
					connect: {
						id
					}
				},
				representationType: APPEAL_REPRESENTATION_TYPE.COMMENT,
				originalRepresentation,
				represented: {
					create: {
						...represented,
						email: hasEmail ? represented.email : null,
						lastName: `${represented.lastName} - Source: ${formatSourceMap[source]} - Has email: ${hasEmail}`
					}
				},
				source,
				...(status && { status })
			},
			include: {
				represented: true
			}
		});

		if (status === 'invalid') {
			await client.representationRejectionReasonsSelected.create({
				data: {
					representation: {
						connect: { id: repRecord.id }
					},
					representationRejectionReason: {
						connect: { id: rejectionReason?.id }
					}
				}
			});
		}
	}
}

/**
 * @param {import('#db-client').PrismaClient} client
 * @param {number} id
 * @param {number} lpaId
 */
async function addLpaStatement(client, id, lpaId) {
	await client.representation.create({
		data: {
			appeal: {
				connect: {
					id
				}
			},
			representationType: APPEAL_REPRESENTATION_TYPE.LPA_STATEMENT,
			originalRepresentation: `Every single thing in the world has its own personality - and it is up to you to make friends with the little rascals. Steve wants reflections, so let's give him reflections. It's amazing what you can do with a little love in your heart. Clouds are free they come and go as they please.

The secret to doing anything is believing that you can do it. Anything that you believe you can do strong enough, you can do. Anything. As long as you believe. It looks so good, I might as well not stop. This present moment is perfect simply due to the fact you're experiencing it. Making all those little fluffies that live in the clouds.

You don't want to kill all your dark areas they are very important. I will take some magic white, and a little bit of Vandyke brown and a little touch of yellow. Anyone can paint. Each highlight must have it's own private shadow. Don't fiddle with it all day.`,
			lpa: {
				connect: {
					id: lpaId
				}
			},
			source: 'lpa'
		},
		include: {
			represented: true
		}
	});
}

/**
 * @param {import('#db-client').PrismaClient} client
 * @param {number} id
 * @param {number} appellantId
 * @param {number} lpaId
 * @param {Object<string, number>} counters
 */
async function addFinalComments(client, id, appellantId, lpaId, counters) {
	switch (counters.finalComment) {
		case 1:
			await addFinalComment(client, id, 'appellant', appellantId);
			break;
		case 2:
			await addFinalComment(client, id, 'LPA', lpaId);
			break;
		case 3:
			await addFinalComment(client, id, 'appellant', appellantId);
			await addFinalComment(client, id, 'LPA', lpaId);
			break;
		default:
			break;
	}

	if (counters.finalComment > 2) {
		counters.finalComment = 0;
	} else {
		counters.finalComment++;
	}
}

/**
 * @param {import('#db-client').PrismaClient} client
 * @param {number} id
 * @param {'appellant'|'LPA'} source
 * @param {number} sourceId
 */
async function addFinalComment(client, id, source, sourceId) {
	await client.representation.create({
		data: {
			appeal: {
				connect: {
					id
				}
			},
			representationType:
				source === 'appellant'
					? APPEAL_REPRESENTATION_TYPE.APPELLANT_FINAL_COMMENT
					: APPEAL_REPRESENTATION_TYPE.LPA_FINAL_COMMENT,
			originalRepresentation: `Final comment from ${source}. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
			...(source === 'appellant'
				? {
						represented: {
							connect: {
								// @ts-ignore
								id: sourceId
							}
						}
				  }
				: {
						lpa: {
							connect: {
								// @ts-ignore
								id: sourceId
							}
						}
				  })
		},
		include: {
			represented: true
		}
	});
}

/**
 * @param {import('#db-client').PrismaClient} client
 * @param {number} id
 * @param {number} appellantId
 * @param {number} lpaId
 * @param {Object<string, number>} counters
 */
async function addProofOfEvidence(client, id, appellantId, lpaId, counters) {
	switch (counters.proofOfEvidence) {
		case 1:
			await addProofsEvidence(client, id, 'appellant', appellantId);
			break;
		case 2:
			await addProofsEvidence(client, id, 'LPA', lpaId);
			break;
		case 3:
			await addProofsEvidence(client, id, 'appellant', appellantId);
			await addProofsEvidence(client, id, 'LPA', lpaId);
			break;
		default:
			break;
	}

	if (counters.proofOfEvidence > 2) {
		counters.proofOfEvidence = 0;
	} else {
		counters.proofOfEvidence++;
	}
}

/**
 * @param {import('#db-client').PrismaClient} client
 * @param {number} id
 * @param {'appellant'|'LPA'} source
 * @param {number} sourceId
 */
async function addProofsEvidence(client, id, source, sourceId) {
	const folder = await client.folder.findFirstOrThrow({
		where: {
			path: 'representation/representationAttachments'
		}
	});
	const doc = await client.document.create({
		data: {
			name: `document-${id}-${sourceId}`,
			folderId: folder.id,
			isDeleted: false,
			caseId: id
		},
		include: {
			latestDocumentVersion: true
		}
	});
	const documentVersion = await client.documentVersion.create({
		data: {
			blobStorageContainer: 'document-service-uploads',
			dateCreated: '2024-03-01T13:48:35.847Z',
			description: 'Document img2.jpg (001) imported',
			documentGuid: doc.guid,
			documentType: 'lpaProofOfEvidence',
			draft: false,
			fileName: 'oimg.jpg',
			mime: 'image/jpeg',
			originalFilename: 'oimg.jpg',
			size: 10293,
			stage: 'lpa-questionnaire',
			version: 1
		},
		include: {
			latestVersion: true
		}
	});
	await client.document.update({
		where: {
			guid: doc.guid
		},
		data: {
			latestVersionId: documentVersion.version
		}
	});
	const representation = await client.representation.create({
		data: {
			appeal: {
				connect: {
					id
				}
			},
			representationType:
				source === 'appellant'
					? APPEAL_REPRESENTATION_TYPE.APPELLANT_PROOFS_EVIDENCE
					: APPEAL_REPRESENTATION_TYPE.LPA_PROOFS_EVIDENCE,
			originalRepresentation: ``,
			...(source === 'appellant'
				? {
						represented: {
							connect: {
								// @ts-ignore
								id: sourceId
							}
						}
				  }
				: {
						lpa: {
							connect: {
								// @ts-ignore
								id: sourceId
							}
						}
				  })
		},
		include: {
			represented: true
		}
	});

	await client.representationAttachment.create({
		data: {
			documentGuid: doc.guid,
			version: documentVersion.version,
			representationId: representation.id
		}
	});
}

function getRandomReviewStatus() {
	const pmf = [0.6, 0.2, 0.2];
	const cdf = pmf.map(
		(
			(sum) => (value) =>
				(sum += value)
		)(0)
	);
	const rand = Math.random();
	const index = cdf.findIndex((el) => rand <= el);
	switch (index) {
		case 2:
			return 'valid';
		case 1:
			return 'invalid';
	}
	return null;
}

function addSite(client, appealId, source, address) {
	return client.neighbouringSite.create({
		data: {
			appeal: {
				connect: { id: appealId }
			},
			source,
			address: {
				create: {
					...address
				}
			}
		},
		include: {
			address: true
		}
	});
}