import {
	ClockIcon,
	DoorOpenIcon,
	MapPinIcon,
	UserGroupIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type { HubEvent } from "@/data/events";
import { EventAdmissionBadge } from "@/components/event-admission-badge";
import { EventPlace } from "@/components/event-place";
import { EventJoinLink } from "@/components/event-join-link";
import { EventMoreInfoLink } from "@/components/event-more-info-link";
import { formatEventDateTime } from "@/lib/format-event-datetime";
import { cn } from "cn";

const mergedFooterJoinLinkClassName =
	"text-sm font-medium text-background underline underline-offset-4 hover:text-background/80";

const headerClassName =
	"flex min-h-[2.75rem] items-center bg-foreground px-2 text-xs font-medium text-background";
const labelClassName =
	"inline-flex items-center gap-1.5 leading-none [&_svg]:block [&_svg]:size-3.5 [&_svg]:shrink-0";
const valueClassName =
	"flex min-h-[2.75rem] items-center px-4 text-foreground";
const gridClassName =
	"grid grid-cols-[6.75rem_1fr] gap-0 text-sm [&>dt]:border-b [&>dt]:border-[#F2F0EF]/25 [&>dd]:border-b [&>dd]:border-black [&>dd:not(.col-span-2):last-of-type]:border-b-0";
const mergedFooterRowClassName =
	"col-span-2 flex min-h-[2.75rem] items-center bg-foreground px-3 py-2 text-background";
const mergedFooterButtonRowClassName =
	"col-span-2 flex w-full items-center bg-foreground p-3 text-background";

type EventMobileFieldsGridProps = {
	event: HubEvent;
	footer?: "join" | "more-info";
	linkPlaceMaps?: boolean;
};

function FieldRow({
	label,
	icon,
	children,
}: {
	label: string;
	icon: ReactNode;
	children: ReactNode;
}) {
	return (
		<>
			<dt className={headerClassName}>
				<span className={labelClassName}>
					{icon}
					<span>{label}</span>
				</span>
			</dt>
			<dd className={`${valueClassName} min-w-0`}>{children}</dd>
		</>
	);
}

function MergedFooterRow({
	icon,
	children,
	variant = "link",
}: {
	icon?: ReactNode;
	children: ReactNode;
	variant?: "link" | "button";
}) {
	const rowClassName =
		variant === "button" ? mergedFooterButtonRowClassName : mergedFooterRowClassName;
	return (
		<dd className={cn(rowClassName, "min-w-0")}>
			{icon}
			{children}
		</dd>
	);
}

export function EventMobileFieldsGrid({
	event,
	footer,
	linkPlaceMaps = false,
}: EventMobileFieldsGridProps) {
	const showJoin = footer === "join" && Boolean(event.link);

	return (
		<dl className={gridClassName}>
			<FieldRow
				label="Where"
				icon={<MapPinIcon aria-hidden />}
			>
				<EventPlace event={event} linkMaps={linkPlaceMaps} truncate />
			</FieldRow>
			<FieldRow
				label="When"
				icon={<ClockIcon aria-hidden />}
			>
				<time dateTime={event.startAt}>
					{formatEventDateTime(event.startAt)}
				</time>
			</FieldRow>
			<FieldRow
				label="Admission"
				icon={<DoorOpenIcon aria-hidden />}
			>
				<EventAdmissionBadge admission={event.admission} />
			</FieldRow>
			{showJoin && event.link ? (
				<MergedFooterRow icon={<UserGroupIcon aria-hidden />}>
					<EventJoinLink
						href={event.link}
						className={mergedFooterJoinLinkClassName}
					/>
				</MergedFooterRow>
			) : null}
			{footer === "more-info" ? (
				<MergedFooterRow variant="button">
					<EventMoreInfoLink
						event={event}
						className="h-9 w-full"
						appearance="button"
						iconPosition="start"
					/>
				</MergedFooterRow>
			) : null}
		</dl>
	);
}