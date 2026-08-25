# Temporal API Examples

These examples use the [Temporal API]([https://tc39.es/proposal-temporal/docs/](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)) available natively in Node.js v26+.

The Temporal API replaces the need for libraries like `date-fns-tz` when working with timezones.

## Running

```bash
node 01-parse-date.ts
node 02-display-date.ts
```

## Examples

| File | Description |
|------|-------------|
| `01-parse-date.ts` | Creating a UTC instant from date/time components in a specific timezone (replaces `zonedTimeToUtc` from date-fns-tz) |
| `02-display-date.ts` | Displaying a UTC instant in a specific timezone (replaces `formatInTimeZone` from date-fns-tz) |

## Key Concepts

- **`Temporal.Instant`** — an exact moment in time (like `Date`)
- **`Temporal.ZonedDateTime`** — a date/time with a timezone attached
- **`Temporal.PlainDateTime`** — a "wall clock" date/time with no timezone
- Converting between these types handles DST transitions correctly and explicitly

