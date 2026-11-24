import { ClockIcon, DoorOpenIcon, MapPinIcon, UserGroupIcon } from "lucide-react";

import type { HubEvent } from "@/data/events";
import { EventAdmissionBadge } from "@/components/event-admission-badge";
import { EventJoinLink } from "@/components/event-join-link";
import { EventMapsLink } from "@/components/event-maps-link";
import { EventMobileFieldsGrid } from "@/components/event-mobile-fields-grid";
import { EventPlace } from "@/components/event-place";
import { formatEventDateTime } from "@/lib/format-event-datetime";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type EventDetailFieldsProps = {
	event: HubEvent;
};

export function EventDetailFields({ event }: EventDetailFieldsProps) {
	const hasJoinLink = Boolean(event.link);
	const hasMapsLink = Boolean(event.mapsLink);

	return (
		<div className="w-full min-w-0">
			<div className="overflow-hidden rounded-lg border border-black md:hidden">
				<EventMobileFieldsGrid
					event={event}
					footer={hasJoinLink ? "join" : undefined}
					mapsButton
				/>
			</div>

			<div className="hidden w-full min-w-0 overflow-hidden rounded-xl border border-black bg-card shadow-[0_6px_20px_-4px_rgba(0,0,0,0.18)] md:block">
				<Table className="w-full table-auto">
					<TableHeader>
						<TableRow className="border-black bg-foreground hover:bg-foreground">
							<TableHead className="min-w-[8rem] rounded-tl-xl bg-foreground pl-4 text-background">
								<span className="inline-flex items-center gap-1.5">
									<MapPinIcon className="size-3.5 shrink-0" aria-hidden />
									Where
								</span>
							</TableHead>
							<TableHead className="w-px bg-foreground px-3 text-background whitespace-nowrap">
								<span className="inline-flex items-center gap-1.5">
									<ClockIcon className="size-3.5 shrink-0" aria-hidden />
									When
								</span>
							</TableHead>
							<TableHead
								className={
									hasJoinLink || hasMapsLink
										? "w-px bg-foreground px-3 text-center text-background whitespace-nowrap"
										: "w-px rounded-tr-xl bg-foreground pr-4 pl-3 text-center text-background whitespace-nowrap"
								}
							>
								<span className="inline-flex items-center justify-center gap-1.5">
									<DoorOpenIcon className="size-3.5 shrink-0" aria-hidden />
									Admission
								</span>
							</TableHead>
							{hasJoinLink ? (
								<TableHead
									className={
										hasMapsLink
											? "w-px bg-foreground pr-4 pl-3 text-center text-background whitespace-nowrap"
											: "w-px rounded-tr-xl bg-foreground pr-4 pl-3 text-background whitespace-nowrap"
									}
								>
									<span className="inline-flex items-center gap-1.5">
										<UserGroupIcon className="size-3.5 shrink-0" aria-hidden />
										Join
									</span>
								</TableHead>
							) : null}
							{hasMapsLink ? (
								<TableHead className="w-px rounded-tr-xl bg-foreground pr-4 pl-3 text-center text-background whitespace-nowrap">
									<span className="inline-flex items-center justify-center gap-1.5">
										<MapPinIcon className="size-3.5 shrink-0" aria-hidden />
										Google Maps
									</span>
								</TableHead>
							) : null}
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-black">
						<TableRow className="border-black">
							<TableCell className="min-w-[8rem] py-3 pl-4 align-middle text-sm whitespace-normal break-words">
								<EventPlace event={event} />
							</TableCell>
							<TableCell className="w-px px-3 py-3 align-middle text-sm whitespace-nowrap">
								<time dateTime={event.startAt}>
									{formatEventDateTime(event.startAt)}
								</time>
							</TableCell>
							<TableCell
								className={
									hasJoinLink || hasMapsLink
										? "w-px px-3 py-3 align-middle whitespace-nowrap"
										: "w-px py-3 pr-4 pl-3 align-middle whitespace-nowrap"
								}
							>
								<div className="flex justify-center">
									<EventAdmissionBadge admission={event.admission} />
								</div>
							</TableCell>
							{hasJoinLink && event.link ? (
								<TableCell
									className={
										hasMapsLink
											? "w-px py-3 pr-4 pl-3 align-middle whitespace-nowrap"
											: "w-px py-3 pr-4 pl-3 align-middle whitespace-nowrap"
									}
								>
									<div className="flex justify-center">
										<EventJoinLink
											href={event.link}
											appearance="button"
											iconPosition="start"
											className="h-8 whitespace-nowrap"
										/>
									</div>
								</TableCell>
							) : null}
							{hasMapsLink && event.mapsLink ? (
								<TableCell className="w-px py-3 pr-4 pl-3 align-middle whitespace-nowrap">
									<div className="flex justify-center">
										<EventMapsLink
											href={event.mapsLink}
											label="Google Maps"
											className="h-8 whitespace-nowrap"
										/>
									</div>
								</TableCell>
							) : null}
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}