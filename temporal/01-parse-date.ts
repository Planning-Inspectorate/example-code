/**
 * Temporal API: Parsing date/time in a specific timezone
 *
 * Previously with date-fns-tz:
 *   import { zonedTimeToUtc } from 'date-fns-tz';
 *   zonedTimeToUtc('2024-04-24 14:00', 'Europe/London');
 *
 * With Temporal, we create a ZonedDateTime directly in the target timezone,
 * then convert to an Instant (UTC).
 */

interface DateTimeParams {
	year: number;
	month: number;
	day: number;
	hour?: number;
	minute?: number;
}

/**
 * Parse the date and time parameters in Europe/London,
 * returning a Temporal.Instant (represents an exact moment in UTC).
 */
function parseDate({ year, month, day, hour = 0, minute = 0 }: DateTimeParams): Temporal.Instant {
	const zonedDateTime = Temporal.ZonedDateTime.from({
		timeZone: 'Europe/London',
		year,
		month,
		day,
		hour,
		minute,
	});

	return zonedDateTime.toInstant();
}

// During BST (UTC+1): 14:00 London = 13:00 UTC
console.log(parseDate({ year: 2024, month: 4, day: 24, hour: 14 }).toString());
// => 2024-04-24T13:00:00Z

// During GMT (UTC+0): 04:00 London = 04:00 UTC
console.log(parseDate({ year: 2024, month: 11, day: 12, hour: 4 }).toString());
// => 2024-11-12T04:00:00Z

