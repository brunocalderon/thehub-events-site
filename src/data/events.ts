export type HubEvent = {
	id: string;
	name: string;
	startAt: string;
	endAt?: string;
	place: string;
	link?: string;
	description?: string;
	admission?: string;
	posterUrl?: string;
};