const TIME_ZONE = "America/Santiago";

const dateHeadingFormatter = new Intl.DateTimeFormat("en-US", {
	weekday: "long",
	month: "long",
	day: "numeric",
	timeZone: TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
	timeZone: TIME_ZONE,
});

export function eventCalendarBadge(iso: string) {
	const date = new Date(iso);
	const month = new Intl.DateTimeFormat("en-US", {
		month: "short",
		timeZone: TIME_ZONE,
	})
		.format(date)
		.toUpperCase();
	const day = new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		timeZone: TIME_ZONE,
	}).format(date);
	return { month, day };
}

export function eventDateHeading(iso: string) {
	return dateHeadingFormatter.format(new Date(iso));
}

export function eventTimeRange(startAt: string, endAt?: string) {
	const start = timeFormatter.format(new Date(startAt));
	if (!endAt?.trim()) {
		return start;
	}
	const end = timeFormatter.format(new Date(endAt));
	return `${start} – ${end}`;
}