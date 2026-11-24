"use client";

import { useEffect, useState } from "react";
import {
	Calendar1Icon,
	ChevronDownIcon,
	CoinsIcon,
	HeartHandshakeIcon,
	LayoutListIcon,
	PiggyBankIcon,
} from "lucide-react";

import type { AdmissionFilter } from "@/lib/event-admission";
import { cn } from "cn";

type FilterOption = {
	value: AdmissionFilter;
	label: string;
	icon: typeof LayoutListIcon;
};

const primaryOptions: FilterOption[] = [
	{ value: "all", label: "All", icon: LayoutListIcon },
	{ value: "this-week", label: "This Week", icon: Calendar1Icon },
	{ value: "free", label: "Free", icon: HeartHandshakeIcon },
];

const moreOptions: FilterOption[] = [
	{ value: "paid", label: "Paid", icon: CoinsIcon },
	{ value: "donation", label: "Donation", icon: PiggyBankIcon },
];

const moreFilterValues = new Set<AdmissionFilter>(
	moreOptions.map((option) => option.value),
);

type EventsAdmissionFilterProps = {
	value: AdmissionFilter;
	onChange: (value: AdmissionFilter) => void;
};

function FilterButton({
	selected,
	onClick,
	label,
	icon: Icon,
}: {
	selected: boolean;
	onClick: () => void;
	label: string;
	icon: FilterOption["icon"];
}) {
	return (
		<button
			type="button"
			aria-pressed={selected}
			onClick={onClick}
			className={cn(
				"inline-flex h-9 items-center gap-1.5 rounded-lg border border-black px-3 text-sm font-medium transition-colors",
				selected
					? "bg-foreground text-background"
					: "bg-background text-foreground hover:bg-muted",
			)}
		>
			<Icon className="size-5 shrink-0" aria-hidden />
			{label}
		</button>
	);
}

export function EventsAdmissionFilter({
	value,
	onChange,
}: EventsAdmissionFilterProps) {
	const moreFilterActive = moreFilterValues.has(value);
	const [moreOpen, setMoreOpen] = useState(moreFilterActive);

	useEffect(() => {
		if (moreFilterActive) {
			setMoreOpen(true);
		}
	}, [moreFilterActive]);

	return (
		<div
			className="flex w-full flex-col gap-2"
			role="group"
			aria-label="Filter events"
		>
			<div className="flex w-full flex-wrap gap-2">
				{primaryOptions.map((option) => (
					<FilterButton
						key={option.value}
						selected={value === option.value}
						onClick={() => {
							onChange(option.value);
							setMoreOpen(false);
						}}
						label={option.label}
						icon={option.icon}
					/>
				))}
				<button
					type="button"
					aria-expanded={moreOpen}
					aria-pressed={moreFilterActive}
					onClick={() => setMoreOpen((open) => !open)}
					className={cn(
						"inline-flex h-9 items-center gap-1.5 rounded-lg border border-black px-3 text-sm font-medium transition-colors",
						moreFilterActive
							? "bg-foreground text-background"
							: "bg-background text-foreground hover:bg-muted",
					)}
				>
					More filters
					<ChevronDownIcon
						className={cn(
							"size-5 shrink-0 transition-transform",
							moreOpen && "rotate-180",
						)}
						aria-hidden
					/>
				</button>
			</div>
			{moreOpen ? (
				<div className="flex w-full flex-wrap gap-2">
					{moreOptions.map((option) => (
						<FilterButton
							key={option.value}
							selected={value === option.value}
							onClick={() => onChange(option.value)}
							label={option.label}
							icon={option.icon}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}