"use client";

import { ClockIcon, DoorOpenIcon, EyeIcon, MapPinIcon } from "lucide-react";
import { useMemo, useState } from "react";

import type { HubEvent } from "@/data/events";
import { EventAdmissionBadge } from "@/components/event-admission-badge";
import { EventsAdmissionFilter } from "@/components/events-admission-filter";
import { EventMobileFieldsGrid } from "@/components/event-mobile-fields-grid";
import {
	type AdmissionFilter,
	matchesAdmissionFilter,
} from "@/lib/event-admission";
import { EventMoreInfoLink } from "@/components/event-more-info-link";
import { formatEventDateTime } from "@/lib/format-event-datetime";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type EventsListProps = {
	events?: HubEvent[];
};

function EventNameBlock({ event }: { event: HubEvent }) {
	return (
		<span
			title={event.name}
			className="block min-w-0 truncate font-medium whitespace-nowrap"
		>
			{event.name}
		</span>
	);
}

function EventMobileCard({ event }: { event: HubEvent }) {
	return (
		<div className="overflow-hidden rounded-lg border border-black">
			<div className="min-w-0 overflow-hidden border-b border-black bg-foreground px-4 py-3 text-background">
				<EventNameBlock event={event} />
			</div>
			<EventMobileFieldsGrid event={event} footer="more-info" />
		</div>
	);
}

const emptyFilterCopy: Record<Exclude<AdmissionFilter, "all">, string> = {
	free: "No free events right now.",
	paid: "No paid events right now.",
	donation: "No donation events right now.",
};

export function EventsList({ events = [] }: EventsListProps) {
	const [admissionFilter, setAdmissionFilter] = useState<AdmissionFilter>("all");

	const filteredEvents = useMemo(
		() =>
			events.filter((event) =>
				matchesAdmissionFilter(event.admission, admissionFilter),
			),
		[events, admissionFilter],
	);

	return (
		<div className="flex w-full flex-col gap-4">
			{events.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyTitle>No upcoming events</EmptyTitle>
						<EmptyDescription>
							Add rows to the Events table in Airtable, run npm run sync:events,
							then rebuild.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : null}

			{events.length > 0 ? (
				<>
					<EventsAdmissionFilter
						value={admissionFilter}
						onChange={setAdmissionFilter}
					/>

					{filteredEvents.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyTitle>
									{admissionFilter === "all"
										? "No upcoming events"
										: emptyFilterCopy[admissionFilter]}
								</EmptyTitle>
								<EmptyDescription>
									Try another filter or check back after the next sync.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : null}

					{filteredEvents.length > 0 ? (
						<div className="flex flex-col gap-3 md:hidden">
							{filteredEvents.map((event) => (
								<EventMobileCard key={event.id} event={event} />
							))}
						</div>
					) : null}

					{filteredEvents.length > 0 ? (
					<div className="hidden w-full min-w-0 max-w-7xl overflow-hidden rounded-xl border border-black bg-card shadow-[0_6px_20px_-4px_rgba(0,0,0,0.18)] md:block">
						<Table className="w-full table-auto">
							<TableHeader>
								<TableRow className="border-black bg-foreground hover:bg-foreground">
									<TableHead className="max-w-48 min-w-[8rem] rounded-tl-xl bg-foreground pl-4 text-background">
										Event
									</TableHead>
									<TableHead className="max-w-40 min-w-[6rem] bg-foreground text-background">
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
									<TableHead className="w-px bg-foreground px-3 text-center text-background whitespace-nowrap">
										<span className="inline-flex items-center justify-center gap-1.5">
											<DoorOpenIcon className="size-3.5 shrink-0" aria-hidden />
											Admission
										</span>
									</TableHead>
									<TableHead className="w-px rounded-tr-xl bg-foreground pr-4 pl-3 text-center text-background whitespace-nowrap">
										<span className="inline-flex items-center justify-center gap-1.5">
											<EyeIcon className="size-3.5 shrink-0" aria-hidden />
											View more info
										</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-black">
								{filteredEvents.map((event) => (
									<TableRow key={event.id} className="border-black">
										<TableCell className="max-w-48 min-w-0 py-3 pl-4 align-middle md:min-w-[8rem]">
											<EventNameBlock event={event} />
										</TableCell>
										<TableCell className="max-w-40 min-w-0 py-3 align-middle text-sm text-foreground">
											<span
												className="block min-w-0 truncate"
												title={event.place}
											>
												{event.place}
											</span>
										</TableCell>
										<TableCell className="w-px px-3 py-3 align-middle text-sm whitespace-nowrap">
											<time dateTime={event.startAt}>
												{formatEventDateTime(event.startAt)}
											</time>
										</TableCell>
										<TableCell className="w-px px-3 py-3 align-middle whitespace-nowrap">
											<div className="flex justify-center">
												<EventAdmissionBadge admission={event.admission} />
											</div>
										</TableCell>
										<TableCell className="w-px py-3 pr-4 pl-3 align-middle whitespace-nowrap">
											<div className="flex justify-center">
												<EventMoreInfoLink
													event={event}
													appearance="button"
													iconPosition="start"
													className="h-8 whitespace-nowrap"
												/>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter className="border-0 bg-transparent">
								<TableRow className="border-0 hover:bg-foreground">
									<TableCell
										colSpan={5}
										className="h-3 rounded-b-xl bg-foreground p-0"
									/>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
					) : null}
				</>
			) : null}
		</div>
	);
}