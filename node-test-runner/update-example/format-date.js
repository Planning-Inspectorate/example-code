import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { isValid } from 'date-fns';

const ukTimeZone = 'Europe/London';

/**
 * Display the date in Europe/London
 * @param {Date|string} [date]
 * @param {Object} [options]
 * @param {string} [options.format] date formatting string
 * @returns {string} formatted date string or empty string if invalid value passed in
 */
export const formatDateForDisplay = (date, { format = 'd MMM yyyy' } = { format: 'd MMM yyyy' }) => {
	if (!date || !isValid(new Date(date))) return '';

	return formatInTimeZone(date, ukTimeZone, format);
};

/**
 * @typedef {Object} DateTimeParams
 * @property {number} year
 * @property {number} month
 * @property {number} day
 * @property {number} [hour]
 * @property {number} [minute]
 * @property {boolean} [convertToUTC]
 */

/**
 * Parse the date and time parameters provided by a user
 * @param {DateTimeParams} params
 * @returns {Date}
 */
export const parseDateInput = ({ year, month, day, hour = 0, minute = 0 }) => {
	const dateStr = `${year}-${pad(month)}-${pad(day)}`;
	const timeStr = `${pad(hour)}:${pad(minute)}`;
	return toZonedTime(`${dateStr} ${timeStr}`, ukTimeZone);
};

/**
 * Pad a number with leading zeros
 *
 * @param {number} num
 * @params {number} [length]
 * @returns {string}
 */
const pad = (num, length = 2) => {
	return num.toString().padStart(length, '0');
};
