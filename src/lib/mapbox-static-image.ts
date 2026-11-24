import { mapboxStaticMapImageUrl as mapboxStaticMapImageUrlJs } from "../../functions/lib/mapbox-static-image.js";

export type GpsCoordinates = {
	lat: number;
	lng: number;
};

/** Mapbox Static Images API URL (used at sync time; prefer `event.mapImage` on the site). */
export function mapboxStaticMapImageUrl(
	coordinates: GpsCoordinates,
	accessToken: string,
): string | undefined {
	return mapboxStaticMapImageUrlJs(coordinates, accessToken);
}