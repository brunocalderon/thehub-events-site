import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** @returns {Record<string, string>} */
function readDotEnv() {
	const envPath = resolve(process.cwd(), ".env");
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
export function readWranglerVars() {
	const configPath = resolve(process.cwd(), "wrangler.jsonc");
	try {
		const raw = readFileSync(configPath, "utf8");
		const json = raw
			.replace(/\/\*[\s\S]*?\*\//g, "")
			.replace(/^\s*\/\/.*$/gm, "");
		const config = JSON.parse(json) as { vars?: Record<string, unknown> };
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

export function resolveSiteVar(key: string): string | undefined {
	const dotenv = readDotEnv();
	const wranglerVars = readWranglerVars();
	return dotenv[key] ?? process.env[key] ?? wranglerVars[key];
}

/** Secrets and other values that must not live in committed `wrangler.jsonc` vars. */
export function resolveBuildSecret(key: string): string | undefined {
	const dotenv = readDotEnv();
	return dotenv[key] ?? process.env[key];
}