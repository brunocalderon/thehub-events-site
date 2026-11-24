const FIELD_NAME = "Event Name";
const START_FIELDS = ["Start Date", "Start", "eventStart"];
const END_FIELDS = ["End Date", "End", "eventEnd"];
const PLACE_FIELDS = ["Location", "Place", "eventPlace"];
const LINK_FIELDS = ["Event Link", "Link", "URL", "Purchase Link", "Ticket Link"];
const MAPS_LINK_FIELDS = ["Google Maps Link", "Maps Link", "googleMapsLink"];
const DESCRIPTION_FIELDS = ["Description", "Notes"];
const ID_FIELDS = ["Event ID", "Slug", "eventId"];
const STATUS_FIELD = "Status";
const PUBLISH_FIELD = "Publish";
const ADMISSION_FIELD = "Admission";
const POSTER_FIELD = "Poster Image";
const GPS_FIELDS = ["GPS Coordinates", "GPS", "gpsCoordinates"];

/** Grid view name — row order from the Airtable Events view. */
export const DEFAULT_EVENTS_VIEW = "Events";

const QUERY_PARAMS =
	"cellFormat=string&timeZone=America%2FSantiago&userLocale=en_US";

/**
 * @typedef {{
 *   id: string;
 *   name: string;
 *   startAt: string;
 *   endAt?: string;
 *   place: string;
 *   mapsLink?: string;
 *   link?: string;
 *   description?: string; // Airtable rich text (markdown)
 *   admission?: string;
 *   posterUrl?: string;
 *   gps?: { lat: number; lng: number };
 *   mapImage?: string;
 * }} PublicEvent
 */

/**
 * @param {string | undefined} baseId
 * @param {string | undefined} table
 */
export function airtableConfig(baseId, table) {
	const resolvedBaseId = typeof baseId === "string" ? baseId.trim() : "";
	const resolvedTable = typeof table === "string" ? table.trim() : "";

	if (!resolvedBaseId) {
		throw new Error("Missing AIRTABLE_BASE_ID");
	}
	if (!resolvedTable) {
		throw new Error("Missing AIRTABLE_EVENTS_TABLE");
	}

	return {
		baseId: resolvedBaseId,
		table: resolvedTable,
	};
}

/**
 * @param {Record<string, unknown>} fields
 * @param {string[]} names
 */
function readFirstString(fields, names) {
	for (const name of names) {
		const value = fields[name];
		if (typeof value === "string" && value.trim() !== "") {
			return value.trim();
		}
	}
	return undefined;
}

/**
 * @param {unknown} value
 * @param {string} label
 */
function requiredFromFields(fields, names, label) {
	const resolved = readFirstString(fields, names);
	if (!resolved) {
		throw new Error(`Missing ${label} on Airtable record`);
	}
	return resolved;
}

/**
 * @param {unknown} value
 */
function optionalString(value) {
	if (typeof value !== "string") {
		return undefined;
	}
	const trimmed = value.trim();
	return trimmed === "" ? undefined : trimmed;
}

/**
 * @param {unknown} value
 */
function readRichTextDescription(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed === "" ? undefined : trimmed;
	}

	if (value && typeof value === "object" && "state" in value && "value" in value) {
		const inner = /** @type {{ value?: unknown }} */ (value).value;
		if (typeof inner === "string" && inner.trim() !== "") {
			return inner.trim();
		}
	}

	return undefined;
}

/**
 * @param {unknown} value
 * @returns {{ lat: number; lng: number } | undefined}
 */
function readGpsCoordinates(value) {
	if (typeof value !== "string") {
		return undefined;
	}
	const trimmed = value.trim();
	if (!trimmed) {
		return undefined;
	}
	const parts = trimmed.split(",").map((part) => part.trim());
	if (parts.length !== 2) {
		return undefined;
	}
	const lat = Number.parseFloat(parts[0]);
	const lng = Number.parseFloat(parts[1]);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return undefined;
	}
	if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
		return undefined;
	}
	return { lat, lng };
}

/**
 * @param {Record<string, unknown>} fields
 */
function isVisibleInList(fields) {
	const status = optionalString(fields[STATUS_FIELD]);
	if (status !== "Approved") {
		return false;
	}

	const publish = fields[PUBLISH_FIELD];
	if (publish === false || publish === "false" || publish === 0) {
		return false;
	}

	return true;
}

/**
 * @param {string} raw
 */
function normalizeUrl(raw) {
	const trimmed = raw.trim();
	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}
	return `https://${trimmed}`;
}

/**
 * @param {string} hour12
 * @param {"am" | "pm" | string} ampm
 */
function hour12To24(hour12, ampm) {
	let hour = Number.parseInt(hour12, 10);
	if (Number.isNaN(hour) || hour < 1 || hour > 12) {
		throw new Error(`Invalid hour: ${hour12}`);
	}
	const normalized = ampm.trim().toLowerCase().replace(/\./g, "");
	const isPm = normalized.startsWith("p");
	if (isPm && hour !== 12) {
		hour += 12;
	} else if (!isPm && hour === 12) {
		hour = 0;
	}
	return hour;
}

/**
 * @param {string} datePart YYYY-MM-DD
 * @param {string} hour
 * @param {string} minute
 * @param {string} second
 * @returns {string}
 */
function santiagoLocalToIso(datePart, hour, minute, second) {
	const candidate = `${datePart}T${String(hour).padStart(2, "0")}:${minute}:${second}-03:00`;
	const parsed = Date.parse(candidate);
	if (Number.isNaN(parsed)) {
		throw new Error(`Could not parse datetime parts: ${datePart} ${hour}:${minute}`);
	}
	return new Date(parsed).toISOString();
}

/**
 * @param {string} raw
 */
function parseAirtableDateTime(raw) {
	const trimmed = raw.trim();
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
		const parsed = Date.parse(trimmed);
		if (!Number.isNaN(parsed)) {
			return new Date(parsed).toISOString();
		}
	}

	const twelveHourMatch = trimmed.match(
		/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap])(?:\.?\s*m\.?)?$/i,
	);
	if (twelveHourMatch) {
		const [, datePart, hour12, minute, second = "00", ampmLetter] = twelveHourMatch;
		const hour24 = hour12To24(hour12, `${ampmLetter}m`);
		return santiagoLocalToIso(datePart, String(hour24), minute, second);
	}

	const localMatch = trimmed.match(
		/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
	);
	if (localMatch) {
		const [, datePart, hour, minute, second = "00"] = localMatch;
		return santiagoLocalToIso(datePart, hour, minute, second);
	}

	const parsed = Date.parse(trimmed);
	if (!Number.isNaN(parsed)) {
		return new Date(parsed).toISOString();
	}

	throw new Error(`Could not parse datetime: ${raw}`);
}

/**
 * @param {unknown} value
 */
function readPosterUrl(value) {
	if (Array.isArray(value) && value[0] && typeof value[0] === "object") {
		const url = /** @type {{ url?: string }} */ (value[0]).url;
		if (typeof url === "string" && url.trim() !== "") {
			return url.trim();
		}
	}

	if (typeof value === "string") {
		const match = value.match(/\((https?:\/\/[^)\s]+)\)\s*$/);
		if (match?.[1]) {
			return match[1];
		}
	}

	return undefined;
}

/**
 * @param {{ id: string; fields?: Record<string, unknown> }} record
 * @returns {PublicEvent | null}
 */
export function mapAirtableRecord(record) {
	const fields = record.fields ?? {};

	if (!isVisibleInList(fields)) {
		return null;
	}

	try {
		const name = requiredFromFields(fields, [FIELD_NAME], FIELD_NAME);
		const startRaw = requiredFromFields(fields, START_FIELDS, "Start Date");
		const startAt = parseAirtableDateTime(startRaw);
		const endRaw = readFirstString(fields, END_FIELDS);
		const place = readFirstString(fields, PLACE_FIELDS) ?? "TBA";
		const linkRaw = readFirstString(fields, LINK_FIELDS);
		const mapsLinkRaw = readFirstString(fields, MAPS_LINK_FIELDS);
		let description;
		for (const name of DESCRIPTION_FIELDS) {
			description = readRichTextDescription(fields[name]);
			if (description) break;
		}
		const admission = optionalString(fields[ADMISSION_FIELD]);
		const posterUrl = readPosterUrl(fields[POSTER_FIELD]);
		const eventId = readFirstString(fields, ID_FIELDS);
		let gps;
		for (const fieldName of GPS_FIELDS) {
			gps = readGpsCoordinates(fields[fieldName]);
			if (gps) {
				break;
			}
		}

		return {
			id: eventId ?? record.id,
			name,
			startAt,
			...(endRaw ? { endAt: parseAirtableDateTime(endRaw) } : {}),
			place,
			...(mapsLinkRaw ? { mapsLink: normalizeUrl(mapsLinkRaw) } : {}),
			...(linkRaw ? { link: normalizeUrl(linkRaw) } : {}),
			...(description ? { description } : {}),
			...(admission ? { admission } : {}),
			...(posterUrl ? { posterUrl } : {}),
			...(gps ? { gps } : {}),
		};
	} catch {
		return null;
	}
}

/**
 * @param {string} token
 * @param {{ baseId?: string; table?: string; view?: string }} [options]
 * @returns {Promise<PublicEvent[]>}
 */
export async function fetchAirtableEvents(token, options = {}) {
	const { baseId, table } = airtableConfig(options.baseId, options.table);
	const view =
		typeof options.view === "string" && options.view.trim() !== ""
			? options.view.trim()
			: DEFAULT_EVENTS_VIEW;

	/** @type {PublicEvent[]} */
	const events = [];
	let offset;

	do {
		const params = new URLSearchParams(QUERY_PARAMS);
		params.set("view", view);
		if (offset) params.set("offset", offset);

		const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?${params}`;

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(`Airtable request failed (${response.status}): ${text}`);
		}

		/** @type {{
		 *   records?: { id: string; fields?: Record<string, unknown> }[];
		 *   offset?: string;
		 * }} */
		const payload = await response.json();
		const records = payload.records ?? [];

		for (const record of records) {
			const mapped = mapAirtableRecord(record);
			if (mapped) {
				events.push(mapped);
			}
		}

		offset = payload.offset;
	} while (offset);

	events.sort(
		(a, b) => Date.parse(a.startAt) - Date.parse(b.startAt),
	);

	return events;
}