import type { HubEvent } from "@/data/events";

/** Home list: events whose start is still in the future (detail pages keep past events). */
export function filterUpcomingEvents(
	events: HubEvent[],
	now: Date = new Date(),
): HubEvent[] {
	const nowMs = now.getTime();
	return events.filter((event) => Date.parse(event.startAt) > nowMs);
}

export function isUpcomingEvent(event: HubEvent, now: Date = new Date()): boolean {
	return Date.parse(event.startAt) > now.getTime();
}