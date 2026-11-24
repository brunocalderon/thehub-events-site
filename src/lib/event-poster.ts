/** Local default when Airtable has no Poster Image. */
export const DEFAULT_EVENT_POSTER_URL = "/event-poster-default.jpg";

export function eventPosterSrc(posterUrl?: string): string {
	if (posterUrl?.trim()) {
		return posterUrl.trim();
	}
	return DEFAULT_EVENT_POSTER_URL;
}

export function hasCustomEventPoster(posterUrl?: string): boolean {
	return Boolean(posterUrl?.trim());
}