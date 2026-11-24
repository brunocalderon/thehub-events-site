import { MapPinIcon } from "lucide-react";

import type { HubEvent } from "@/data/events";
import { EventAdmissionBadge } from "@/components/event-admission-badge";
import { EventDescriptionMarkdown } from "@/components/event-description-markdown";
import { EventJoinLink } from "@/components/event-join-link";
import { EventMapsLink } from "@/components/event-maps-link";
import { EventPlace } from "@/components/event-place";
import { EventPosterZoom } from "@/components/event-poster-zoom";
import {
	eventCalendarBadge,
	eventDateHeading,
	eventTimeRange,
} from "@/lib/format-event-datetime-detail";
import { eventPosterSrc } from "@/lib/event-poster";
import { cn } from "cn";

type EventDetailLumaLayoutProps = {
	event: HubEvent;
};

export function EventDetailLumaLayout({ event }: EventDetailLumaLayoutProps) {
	const posterSrc = eventPosterSrc(event.posterUrl);
	const { month, day } = eventCalendarBadge(event.startAt);
	const hasDescription = Boolean(event.description?.trim());
	const hasJoinLink = Boolean(event.link?.trim());
	const hasMapsLink = Boolean(event.mapsLink?.trim());
	const mapImageUrl = event.mapImage;
	const showLocationSection = hasMapsLink || Boolean(mapImageUrl);
	const admissionLabel = event.admission?.trim();

	return (
		<div className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-12">
			<aside className="flex w-full min-w-0 flex-col gap-4 lg:sticky lg:top-6">
				<EventPosterZoom
					src={posterSrc}
					alt={event.name}
					variant="cover"
					className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none"
				/>
			</aside>

			<div className="flex min-w-0 flex-col gap-8">
				<header className="flex flex-col gap-5">
					<div className="flex flex-col gap-2">
						{admissionLabel ? (
							<div className="flex flex-wrap gap-2">
								<EventAdmissionBadge admission={event.admission} />
							</div>
						) : null}
						<h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
							{event.name}
						</h1>
					</div>

					<div className="flex gap-4">
						<div
							className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg border border-black bg-muted/40 text-foreground"
							aria-hidden
						>
							<span className="text-[0.65rem] font-semibold leading-none tracking-wide">
								{month}
							</span>
							<span className="text-xl font-semibold leading-tight">{day}</span>
						</div>
						<div className="flex min-w-0 flex-col justify-center gap-0.5">
							<time
								dateTime={event.startAt}
								className="text-base font-medium text-foreground"
							>
								{eventDateHeading(event.startAt)}
							</time>
							<p className="text-sm text-muted-foreground">
								{eventTimeRange(event.startAt, event.endAt)}
							</p>
						</div>
					</div>

					<div className="flex gap-4">
						<div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-black bg-muted/40 text-foreground">
							<MapPinIcon className="size-5" aria-hidden />
						</div>
						<div className="flex min-w-0 flex-col justify-center gap-0.5">
							<p className="text-base font-medium text-foreground">Location</p>
							<div className="text-sm text-foreground">
								<EventPlace event={event} />
							</div>
						</div>
					</div>
				</header>

				{hasJoinLink && event.link ? (
					<section
						className="rounded-xl border border-black bg-card p-5 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.12)]"
						aria-labelledby="event-registration-heading"
					>
						<p
							id="event-registration-heading"
							className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
						>
							Registration
						</p>
						<p className="mt-2 text-sm text-foreground">
							This event requires registration
						</p>
						<EventJoinLink
							href={event.link}
							appearance="button"
							iconPosition="start"
							className={cn(
								"mt-4 h-10 w-full border-black bg-foreground text-background hover:bg-foreground/90",
							)}
						/>
					</section>
				) : null}

				{hasDescription && event.description ? (
					<section className="flex flex-col gap-3" aria-labelledby="about-event-heading">
						<h2
							id="about-event-heading"
							className="text-lg font-semibold tracking-tight text-foreground"
						>
							About the Event
						</h2>
						<EventDescriptionMarkdown markdown={event.description} />
					</section>
				) : null}

				{showLocationSection ? (
					<section className="flex flex-col gap-3" aria-labelledby="location-map-heading">
						<h2
							id="location-map-heading"
							className="text-lg font-semibold tracking-tight text-foreground"
						>
							Map
						</h2>
						{mapImageUrl ? (
							<div className="overflow-hidden rounded-xl border border-black bg-muted/20">
								{hasMapsLink && event.mapsLink ? (
									<a
										href={event.mapsLink}
										target="_blank"
										rel="noopener noreferrer"
										className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
									>
										<img
											src={mapImageUrl}
											alt={`Map near ${event.place}`}
											className="aspect-[16/10] w-full object-cover"
											loading="lazy"
											decoding="async"
											width={640}
											height={400}
										/>
									</a>
								) : (
									<img
										src={mapImageUrl}
										alt={`Map near ${event.place}`}
										className="aspect-[16/10] w-full object-cover"
										loading="lazy"
										decoding="async"
										width={640}
										height={400}
									/>
								)}
								<div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-2">
									{hasMapsLink && event.mapsLink ? (
										<EventMapsLink
											href={event.mapsLink}
											label="Open in Google Maps"
											className="h-8"
										/>
									) : null}
									<p className="ml-auto text-[0.65rem] text-muted-foreground">
										© Mapbox © OpenStreetMap
									</p>
								</div>
							</div>
						) : hasMapsLink && event.mapsLink ? (
							<EventMapsLink
								href={event.mapsLink}
								label="Open in Google Maps"
							/>
						) : null}
					</section>
				) : null}
			</div>
		</div>
	);
}