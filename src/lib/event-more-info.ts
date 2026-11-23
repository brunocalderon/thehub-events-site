import type { HubEvent } from "@/data/events";

export function eventMoreInfoHref(event: HubEvent) {
	return `/events/${encodeURIComponent(event.id)}`;
}

export function isExternalMoreInfo(_event: HubEvent) {
	return false;
}