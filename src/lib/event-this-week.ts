const TZ = "America/Santiago";

function santiagoDateKey(date: Date): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

function parseDateKey(key: string) {
	const [y, m, d] = key.split("-").map((part) => Number.parseInt(part, 10));
	return { y, m, d };
}

function formatDateKey(y: number, m: number, d: number): string {
	return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Monday-start week containing `dateKey` (YYYY-MM-DD). */
function weekMondayKey(dateKey: string): string {
	const { y, m, d } = parseDateKey(dateKey);
	const utc = new Date(Date.UTC(y, m - 1, d));
	const daysSinceMonday = (utc.getUTCDay() + 6) % 7;
	const monday = new Date(Date.UTC(y, m - 1, d - daysSinceMonday));
	return formatDateKey(
		monday.getUTCFullYear(),
		monday.getUTCMonth() + 1,
		monday.getUTCDate(),
	);
}

function addDaysToDateKey(dateKey: string, days: number): string {
	const { y, m, d } = parseDateKey(dateKey);
	const next = new Date(Date.UTC(y, m - 1, d + days));
	return formatDateKey(
		next.getUTCFullYear(),
		next.getUTCMonth() + 1,
		next.getUTCDate(),
	);
}

export function isEventThisWeek(startAtIso: string, now: Date = new Date()): boolean {
	const eventKey = santiagoDateKey(new Date(startAtIso));
	const nowKey = santiagoDateKey(now);
	const weekStart = weekMondayKey(nowKey);
	const weekEnd = addDaysToDateKey(weekStart, 6);
	return eventKey >= weekStart && eventKey <= weekEnd;
}