import {
	BanknoteCheckIcon,
	BanknoteXIcon,
	LayoutListIcon,
	PiggyBankIcon,
} from "lucide-react";

import type { AdmissionFilter } from "@/lib/event-admission";
import { cn } from "cn";

const options: {
	value: AdmissionFilter;
	label: string;
	icon: typeof LayoutListIcon;
}[] = [
	{ value: "all", label: "All", icon: LayoutListIcon },
	{ value: "free", label: "Free", icon: BanknoteCheckIcon },
	{ value: "paid", label: "Paid", icon: BanknoteXIcon },
	{ value: "donation", label: "Donation", icon: PiggyBankIcon },
];

type EventsAdmissionFilterProps = {
	value: AdmissionFilter;
	onChange: (value: AdmissionFilter) => void;
};

export function EventsAdmissionFilter({
	value,
	onChange,
}: EventsAdmissionFilterProps) {
	return (
		<div
			className="flex w-full flex-wrap gap-2"
			role="group"
			aria-label="Filter events by admission"
		>
			{options.map(({ value: optionValue, label, icon: Icon }) => {
				const selected = value === optionValue;
				return (
					<button
						key={optionValue}
						type="button"
						aria-pressed={selected}
						onClick={() => onChange(optionValue)}
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
			})}
		</div>
	);
}