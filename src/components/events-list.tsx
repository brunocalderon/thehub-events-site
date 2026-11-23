import { ClockIcon, DoorOpenIcon, EyeIcon, MapPinIcon } from "lucide-react";

import type { HubEvent } from "@/data/events";
import { EventAdmissionBadge } from "@/components/event-admission-badge";
import { EventMobileFieldsGrid } from "@/components/event-mobile-fields-grid";
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
		<span className="block min-w-0 font-medium text-balance">{event.name}</span>
	);
}

function EventMobileCard({ event }: { event: HubEvent }) {
	return (
		<div className="overflow-hidden rounded-lg border border-black">
			<div className="border-b border-black bg-foreground px-4 py-3 text-background">
				<EventNameBlock event={event} />
			</div>
			<EventMobileFieldsGrid event={event} footer="more-info" />
		</div>
	);
}

export function EventsList({ events = [] }: EventsListProps) {
	return (
		<div className="w-full">
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
					<div className="flex flex-col gap-3 md:hidden">
						{events.map((event) => (
							<EventMobileCard key={event.id} event={event} />
						))}
					</div>

					<div className="hidden w-full min-w-0 max-w-7xl overflow-hidden rounded-xl border border-black bg-card shadow-[0_6px_20px_-4px_rgba(0,0,0,0.18)] md:block">
						<Table className="w-full table-auto">
							<TableHeader>
								<TableRow className="border-black bg-foreground hover:bg-foreground">
									<TableHead className="min-w-[10rem] rounded-tl-xl bg-foreground pl-4 text-background">
										Event
									</TableHead>
									<TableHead className="min-w-[8rem] bg-foreground text-background">
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
									<TableHead className="w-px rounded-tr-xl bg-foreground pr-4 pl-3 text-background whitespace-nowrap">
										<span className="inline-flex items-center gap-1.5">
											<EyeIcon className="size-3.5 shrink-0" aria-hidden />
											View more info
										</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-black">
								{events.map((event) => (
									<TableRow key={event.id} className="border-black">
										<TableCell className="min-w-[10rem] max-w-md py-3 pl-4 align-top whitespace-normal">
											<EventNameBlock event={event} />
										</TableCell>
										<TableCell className="min-w-[8rem] py-3 align-top text-sm text-foreground whitespace-normal break-words">
											{event.place}
										</TableCell>
										<TableCell className="w-px px-3 py-3 align-top text-sm whitespace-nowrap">
											<time dateTime={event.startAt}>
												{formatEventDateTime(event.startAt)}
											</time>
										</TableCell>
										<TableCell className="w-px px-3 py-3 align-top whitespace-nowrap">
											<div className="flex justify-center">
												<EventAdmissionBadge admission={event.admission} />
											</div>
										</TableCell>
										<TableCell className="w-px py-3 pr-4 pl-3 align-top whitespace-nowrap">
											<EventMoreInfoLink event={event} />
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
				</>
			) : null}
		</div>
	);
}