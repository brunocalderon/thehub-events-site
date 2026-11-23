import { marked } from "marked";

marked.setOptions({
	gfm: true,
	breaks: true,
});

/** Airtable rich text is markdown; normalize legacy plain text for display. */
export function renderEventDescriptionHtml(markdown: string): string {
	const trimmed = markdown.trim();
	if (!trimmed) {
		return "";
	}

	return marked.parse(trimmed, { async: false });
}