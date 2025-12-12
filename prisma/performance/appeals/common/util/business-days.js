import {
	CONFIG_APPEAL_TIMETABLE
} from './support.js';
import { APPEAL_CASE_TYPE } from './data-model-enums.js';
import isExpeditedAppealType from './is-expedited-appeal-type.js';

/**
 * Mock of calculateTimetable
 */
export const calculateTimetable = async (appealType, startedAt, procedureType = 'written') => {
	if (startedAt) {
		const startDate = new Date(startedAt);

		const fullAppealTypeKey = appealType === APPEAL_CASE_TYPE.H ? appealType : APPEAL_CASE_TYPE.W;
		const expeditedAppealTypeKey = APPEAL_CASE_TYPE.D;
		const appealTimetableConfig = !isExpeditedAppealType(appealType)
			? CONFIG_APPEAL_TIMETABLE[fullAppealTypeKey][procedureType]
			: CONFIG_APPEAL_TIMETABLE[expeditedAppealTypeKey];

		if (appealTimetableConfig) {
			return Object.fromEntries(
				Object.entries(appealTimetableConfig).map(([fieldName, { daysFromStartDate }]) => {
					let date = new Date(startDate);
					date.setDate(date.getDate() + daysFromStartDate);
					return [fieldName, date];
				})
			);
		}
	}
};

