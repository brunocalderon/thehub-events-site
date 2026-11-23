import { ExternalLinkIcon } from "lucide-react";

import type { HubEvent } from "@/data/events";
import {
	eventMoreInfoHref,
	isExternalMoreInfo,
} from "@/lib/event-more-info";
import { cn } from "cn";

const linkClassName =
	"inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/80";

type EventMoreInfoLinkProps = {
	event: HubEvent;
	className?: string;
};

export function EventMoreInfoLink({ event, className }: EventMoreInfoLinkProps) {
	const href = eventMoreInfoHref(event);
	const external = isExternalMoreInfo(event);

	if (external) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(linkClassName, className)}
			>
				View more info
				<ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
			</a>
		);
	}

	return (
		<a href={href} className={cn(linkClassName, className)}>
			View more info
			<ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
		</a>
	);
}