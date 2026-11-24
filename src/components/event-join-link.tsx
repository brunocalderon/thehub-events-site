import { ExternalLinkIcon } from "lucide-react";

import { cn } from "cn";

const linkClassName =
	"inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/80";

const buttonClassName =
	"inline-flex items-center justify-center gap-1.5 rounded-lg border border-black bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted";

type EventJoinLinkProps = {
	href: string;
	className?: string;
	iconPosition?: "start" | "end";
	appearance?: "link" | "button";
};

export function EventJoinLink({
	href,
	className,
	iconPosition = "end",
	appearance = "link",
}: EventJoinLinkProps) {
	const icon = (
		<ExternalLinkIcon className="size-3.5 shrink-0" aria-hidden />
	);
	const label = "Join";

	const anchorClassName = cn(
		appearance === "button" ? buttonClassName : linkClassName,
		className,
	);

	const content =
		iconPosition === "start" ? (
			<>
				{icon}
				{label}
			</>
		) : (
			<>
				{label}
				{icon}
			</>
		);

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className={anchorClassName}
		>
			{content}
		</a>
	);
}