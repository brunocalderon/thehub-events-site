import type { HubEvent } from "@/data/events";

/** Build output path for a Mapbox static map (file is created in `npm run build`). */
export function eventMapImagePath(event: Pick<HubEvent, "id" | "gps">): string | undefined {
	if (!event.gps) {
		return undefined;
	}
	return `/event-maps/${event.id}.jpg`;
}