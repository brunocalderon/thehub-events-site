const formatter = new Intl.DateTimeFormat("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	timeZone: "America/Santiago",
});

export function formatEventDateTime(iso: string) {
	return formatter.format(new Date(iso));
}