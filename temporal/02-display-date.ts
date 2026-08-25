/**
 * Temporal API: Displaying a UTC instant in a specific timezone
 *
 * Previously with date-fns-tz:
 *   import { formatInTimeZone } from 'date-fns-tz';
 *   formatInTimeZone(date, 'Europe/London', 'dd MMM yyyy HH:mm');
 *
 * With Temporal, we convert an Instant to a ZonedDateTime in the target timezone,
 * then format it using toLocaleString or manual field access.
 */

/**
 * Display a UTC timestamp in Europe/London timezone
 */
function displayDate(isoString: string): string {
	const instant = Temporal.Instant.from(isoString);
	const zonedDateTime = instant.toZonedDateTimeISO('Europe/London');

	// Using toLocaleString for formatted output
	return zonedDateTime.toLocaleString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
}

// During BST (UTC+1): 23:30 UTC = 00:30 next day in London
console.log(displayDate('2024-08-09T23:30:00.000Z'));
// => 10 Aug 2024 00:30

// During BST (UTC+1): 13:00 UTC = 14:00 London
console.log(displayDate('2024-04-24T13:00:00.000Z'));
// => 24 Apr 2024 14:00

// During GMT (UTC+0): 00:00 UTC = 00:00 London
console.log(displayDate('2024-12-11T00:00:00.000Z'));
// => 11 Dec 2024 00:00

