import { ExternalLinkIcon } from "lucide-react";

import { cn } from "cn";

const buttonClassName =
	"inline-flex items-center justify-center gap-1.5 rounded-lg border border-black bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted";

type EventMapsLinkProps = {
	href: string;
	className?: string;
	label?: string;
};

export function EventMapsLink({
	href,
	className,
	label = "Google Maps",
}: EventMapsLinkProps) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(buttonClassName, className)}
		>
			<ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
			{label}
		</a>
	);
}