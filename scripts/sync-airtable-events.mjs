#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fetchAirtableEvents } from "../functions/lib/airtable-events.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicEventsPath = resolve(root, "src/generated/public-events.json");

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

/** @returns {Record<string, string>} */
function readWranglerVars() {
	const configPath = resolve(root, "wrangler.jsonc");
	try {
		const raw = readFileSync(configPath, "utf8");
		const json = raw
			.replace(/\/\*[\s\S]*?\*\//g, "")
			.replace(/^\s*\/\/.*$/gm, "");
		const config = JSON.parse(json);
		const vars = config.vars;
		if (!vars || typeof vars !== "object") return {};
		/** @type {Record<string, string>} */
		const out = {};
		for (const [key, value] of Object.entries(vars)) {
			if (typeof value === "string" && value.trim() !== "") {
				out[key] = value.trim();
			}
		}
		return out;
	} catch {
		return {};
	}
}

function writePublicEvents(events) {
	mkdirSync(dirname(publicEventsPath), { recursive: true });
	writeFileSync(
		publicEventsPath,
		`${JSON.stringify(events, null, "\t")}\n`,
		"utf8",
	);
}

const dotenv = readDotEnv();
const wranglerVars = readWranglerVars();

/** Prefer repo `.env` locally so a stale shell `AIRTABLE_TOKEN` does not win. */
function envVar(key) {
	return dotenv[key] ?? process.env[key] ?? wranglerVars[key];
}

const token = envVar("AIRTABLE_TOKEN");
const baseId = envVar("AIRTABLE_BASE_ID");
const table = envVar("AIRTABLE_EVENTS_TABLE");
const view = envVar("AIRTABLE_EVENTS_VIEW");

if (!token) {
	if (existsSync(publicEventsPath)) {
		console.log(
			"sync-airtable-events: AIRTABLE_TOKEN unset; using existing generated file.",
		);
		process.exit(0);
	}
	writePublicEvents([]);
	console.log(
		"sync-airtable-events: AIRTABLE_TOKEN unset; wrote empty events list.",
	);
	process.exit(0);
}

if (!baseId || !table) {
	console.error(
		"sync-airtable-events: set AIRTABLE_BASE_ID and AIRTABLE_EVENTS_TABLE in wrangler.jsonc, the environment, or .env.",
	);
	process.exit(1);
}

try {
	const events = await fetchAirtableEvents(token, {
		baseId,
		table,
		...(view ? { view } : {}),
	});
	writePublicEvents(events);
	console.log(
		`sync-airtable-events: wrote ${events.length} event(s) for static build.`,
	);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.error("sync-airtable-events:", message);
	const isExplicit =
		process.argv[1]?.includes("sync-airtable-events.mjs") &&
		process.env.npm_lifecycle_event === "sync:events";
	if (isExplicit) {
		process.exit(1);
	}
	if (existsSync(publicEventsPath)) {
		console.log("sync-airtable-events: keeping existing generated file.");
		process.exit(0);
	}
	process.exit(1);
}