#!/usr/bin/env node
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/icons/app-icon.svg");
const iconsDir = resolve(root, "public/icons");

const svg = readFileSync(source);

const outputs = [
	{ name: "apple-touch-icon.png", size: 180 },
	{ name: "icon-192.png", size: 192 },
	{ name: "icon-512.png", size: 512 },
	{ name: "favicon-32.png", size: 32 },
];

for (const { name, size } of outputs) {
	const buffer = await sharp(svg).resize(size, size).png().toBuffer();
	writeFileSync(resolve(iconsDir, name), buffer);
}

const faviconIco = await sharp(svg)
	.resize(32, 32)
	.png()
	.toBuffer();
writeFileSync(resolve(root, "public/favicon.ico"), faviconIco);

const appleTouch = resolve(iconsDir, "apple-touch-icon.png");
copyFileSync(appleTouch, resolve(root, "public/apple-touch-icon.png"));

console.log(
	`generate-pwa-icons: wrote ${outputs.length + 1} raster icons + root apple-touch-icon.png.`,
);