import { ExternalLinkIcon } from "lucide-react";

import { cn } from "cn";

const linkClassName =
	"inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/80";

type EventJoinLinkProps = {
	href: string;
	className?: string;
};

export function EventJoinLink({ href, className }: EventJoinLinkProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(linkClassName, className)}
		>
			Join
			<ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
		</a>
	);
}