import type { HubEvent } from "@/data/events";

export function eventMoreInfoHref(event: HubEvent) {
	if (event.link) {
		return event.link;
	}
	return `/events/${encodeURIComponent(event.id)}`;
}

export function isExternalMoreInfo(event: HubEvent) {
	return Boolean(event.link);
}