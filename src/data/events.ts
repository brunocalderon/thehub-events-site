export type HubEvent = {
	id: string;
	name: string;
	startAt: string;
	endAt?: string;
	place: string;
	mapsLink?: string;
	link?: string;
	/** Airtable rich text field (markdown). */
	description?: string;
	admission?: string;
	posterUrl?: string;
};