/**
 * @param {{ lat: number; lng: number }} coordinates
 * @param {string} accessToken
 * @returns {string | undefined}
 */
export function mapboxStaticMapImageUrl(coordinates, accessToken) {
	const token = accessToken.trim();
	if (!token) {
		return undefined;
	}

	const { lat, lng } = coordinates;
	const width = 640;
	const height = 400;
	const zoom = 14;
	const overlay = `pin-s+000000(${lng},${lat})`;
	const viewport = `${lng},${lat},${zoom},0`;
	const size = `${width}x${height}@2x`;
	const params = new URLSearchParams({ access_token: token });
	return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${overlay}/${viewport}/${size}?${params.toString()}`;
}