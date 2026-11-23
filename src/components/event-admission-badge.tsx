import { Badge } from "@/components/ui/badge";
import { admissionKind } from "@/lib/event-admission";

const paidAdmissionBadgeClassName =
	"border-transparent bg-[#4682B4] text-[#F2F0EF]";
const freeAdmissionBadgeClassName =
	"border-transparent bg-[#2E6F40] text-[#F2F0EF]";

type EventAdmissionBadgeProps = {
	admission?: string;
};

export function EventAdmissionBadge({ admission }: EventAdmissionBadgeProps) {
	const kind = admissionKind(admission);

	switch (kind) {
		case "none":
			return <span className="text-sm text-muted-foreground">—</span>;
		case "paid":
			return (
				<Badge className={paidAdmissionBadgeClassName}>
					{admission!.trim()}
				</Badge>
			);
		case "free":
			return (
				<Badge className={freeAdmissionBadgeClassName}>
					{admission!.trim()}
				</Badge>
			);
		case "other":
			return (
				<Badge variant="outline" className="border-black">
					{admission!.trim()}
				</Badge>
			);
		default: {
			const _exhaustive: never = kind;
			return _exhaustive;
		}
	}
}