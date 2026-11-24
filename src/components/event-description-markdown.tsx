import { renderEventDescriptionHtml } from "@/lib/render-event-description";

type EventDescriptionMarkdownProps = {
	markdown: string;
};

export function EventDescriptionMarkdown({ markdown }: EventDescriptionMarkdownProps) {
	const html = renderEventDescriptionHtml(markdown);
	if (!html) {
		return null;
	}

	return (
		<div
			className="event-description text-sm leading-relaxed text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-3 [&_strong]:font-semibold"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Airtable markdown at build time
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}