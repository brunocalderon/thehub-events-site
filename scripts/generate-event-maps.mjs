#!/usr/bin/env node
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { mapboxStaticMapImageUrl } from "./lib/mapbox-static-image.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicEventsPath = resolve(root, "src/generated/public-events.json");
const eventMapsDir = resolve(root, "public/event-maps");

/** @returns {Record<string, string>} */
function readDotEnv() {
	const envPath = resolve(root, ".env");
	/** @type {Record<string, string>} */
	const vars = {};
	try {
		const raw = readFileSync(envPath, "utf8");
		for (const line of raw.split("\n")) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const eq = trimmed.indexOf("=");
			if (eq === -1) continue;
			const key = trimmed.slice(0, eq).trim();
			const value = trimmed.slice(eq + 1).trim();
			if (value) vars[key] = value;
		}
	} catch {
		// optional
	}
	return vars;
}

function envVar(key) {
	const dotenv = readDotEnv();
	return dotenv[key] ?? process.env[key];
}

/** @returns {import("./lib/airtable-events.js").PublicEvent[]} */
function readEvents() {
	if (!existsSync(publicEventsPath)) {
		return [];
	}
	const raw = readFileSync(publicEventsPath, "utf8");
	return JSON.parse(raw);
}

/**
 * @param {import("./lib/airtable-events.js").PublicEvent[]} events
 * @param {string} mapboxToken
 */
async function writeEventMapImages(events, mapboxToken) {
	mkdirSync(eventMapsDir, { recursive: true });

	const expectedFiles = new Set();

	for (const event of events) {
		if (!event.gps) {
			continue;
		}
		const fileName = `${event.id}.jpg`;
		expectedFiles.add(fileName);
		const outPath = resolve(eventMapsDir, fileName);
		const imageUrl = mapboxStaticMapImageUrl(event.gps, mapboxToken);
		if (!imageUrl) {
			throw new Error(`generate-event-maps: invalid coordinates for ${event.id}`);
		}

		const response = await fetch(imageUrl);
		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(
				`generate-event-maps: Mapbox failed for ${event.id} (${response.status}): ${text.slice(0, 200)}`,
			);
		}
		const bytes = Buffer.from(await response.arrayBuffer());
		if (bytes.length < 1_000) {
			throw new Error(
				`generate-event-maps: Mapbox returned an empty image for ${event.id}`,
			);
		}
		writeFileSync(outPath, bytes);
		console.log(`generate-event-maps: wrote ${fileName} (${bytes.length} bytes)`);
	}

	for (const entry of readdirSync(eventMapsDir)) {
		if (!entry.endsWith(".jpg")) {
			continue;
		}
		if (!expectedFiles.has(entry)) {
			unlinkSync(resolve(eventMapsDir, entry));
			console.log(`generate-event-maps: removed stale ${entry}`);
		}
	}
}

async function main() {
	const events = readEvents();
	const eventsWithGps = events.filter((event) => event.gps);
	if (eventsWithGps.length === 0) {
		console.log("generate-event-maps: no events with GPS; skipping.");
		return;
	}

	const mapboxToken = envVar("MAPBOX_ACCESS_TOKEN");
	if (!mapboxToken) {
		throw new Error(
			"generate-event-maps: set MAPBOX_ACCESS_TOKEN in the environment or .env (required when events have GPS).",
		);
	}

	await writeEventMapImages(events, mapboxToken);
	console.log(
		`generate-event-maps: wrote ${eventsWithGps.length} map image(s) to public/event-maps/.`,
	);
}

main().catch((error) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(message);
	process.exit(1);
});