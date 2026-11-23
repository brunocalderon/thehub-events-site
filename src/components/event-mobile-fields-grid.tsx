import {
	ClockIcon,
	DoorOpenIcon,
	EyeIcon,
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

const headerClassName =
	"flex min-h-[2.75rem] items-center bg-foreground px-2 text-xs font-medium text-background";
const labelClassName =
	"inline-flex items-center gap-1.5 leading-none [&_svg]:block [&_svg]:size-3.5 [&_svg]:shrink-0";
const valueClassName =
	"flex min-h-[2.75rem] items-center px-4 text-foreground";
const gridClassName =
	"grid grid-cols-[6.75rem_1fr] gap-0 text-sm [&>dt]:border-b [&>dt]:border-[#F2F0EF]/25 [&>dt:last-of-type]:border-b-0 [&>dd]:border-b [&>dd]:border-black [&>dd:last-of-type]:border-b-0";

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
				<FieldRow
					label="Join"
					icon={<UserGroupIcon aria-hidden />}
				>
					<EventJoinLink href={event.link} className="w-fit" />
				</FieldRow>
			) : null}
			{footer === "more-info" ? (
				<FieldRow
					label="View more"
					icon={<EyeIcon aria-hidden />}
				>
					<EventMoreInfoLink event={event} className="w-fit" />
				</FieldRow>
			) : null}
		</dl>
	);
}