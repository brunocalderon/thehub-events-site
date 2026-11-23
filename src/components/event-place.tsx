import { ExternalLinkIcon } from "lucide-react";

import type { HubEvent } from "@/data/events";
import { cn } from "cn";

const linkClassName =
	"inline-flex items-center gap-1 text-foreground underline underline-offset-4 hover:text-foreground/80";

type EventPlaceProps = {
	event: Pick<HubEvent, "place" | "mapsLink">;
	/** When true, link to Google Maps when `mapsLink` is set (event detail only). */
	linkMaps?: boolean;
	/** Single-line ellipsis (mobile field grid). */
	truncate?: boolean;
	className?: string;
};

export function EventPlace({
	event,
	linkMaps = false,
	truncate = false,
	className,
}: EventPlaceProps) {
	const { place, mapsLink } = event;
	const textClassName = truncate ? "min-w-0 truncate" : undefined;

	if (linkMaps && mapsLink) {
		return (
			<a
				href={mapsLink}
				target="_blank"
				rel="noopener noreferrer"
				title={place}
				className={cn(
					linkClassName,
					truncate && "w-full max-w-full min-w-0 overflow-hidden",
					className,
				)}
			>
				<span className={textClassName}>{place}</span>
				<ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
			</a>
		);
	}

	return (
		<span
			title={truncate ? place : undefined}
			className={cn(
				"text-foreground",
				truncate && "block w-full min-w-0",
				textClassName,
				className,
			)}
		>
			{place}
		</span>
	);
}