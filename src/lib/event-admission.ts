export type AdmissionKind = "paid" | "free" | "other" | "none";

export type AdmissionFilter = "all" | "free" | "paid";

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
	return "other";
}

export function matchesAdmissionFilter(
	admission: string | undefined,
	filter: AdmissionFilter,
): boolean {
	if (filter === "all") {
		return true;
	}
	return admissionKind(admission) === filter;
}