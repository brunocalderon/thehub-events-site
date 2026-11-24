import type { HubEvent } from "@/data/events";
import { isEventThisWeek } from "@/lib/event-this-week";

export type AdmissionKind = "paid" | "free" | "donation" | "other" | "none";

export type AdmissionFilter =
	| "all"
	| "this-week"
	| "free"
	| "paid"
	| "donation";

export function admissionKind(value: string | undefined): AdmissionKind {
	if (!value?.trim()) {
		return "none";
	}
	const normalized = value.trim().toLowerCase();
	if (normalized === "paid") {
		return "paid";
	}
	if (normalized === "free") {
		return "free";
	}
	if (normalized === "donation" || normalized === "voluntary donation") {
		return "donation";
	}
	return "other";
}

export function matchesAdmissionFilter(
	event: HubEvent,
	filter: AdmissionFilter,
	now: Date = new Date(),
): boolean {
	if (filter === "all") {
		return true;
	}
	if (filter === "this-week") {
		return isEventThisWeek(event.startAt, now);
	}
	return admissionKind(event.admission) === filter;
}