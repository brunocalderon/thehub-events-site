import { useCallback, useEffect, useId, useState } from "react";
import { XIcon } from "lucide-react";

import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

type EventPosterZoomProps = {
	src: string;
	alt?: string;
	className?: string;
	/** Square cover (Luma-style) vs default poster height cap. */
	variant?: "poster" | "cover";
};

export function EventPosterZoom({
	src,
	alt = "",
	className,
	variant = "poster",
}: EventPosterZoomProps) {
	const [open, setOpen] = useState(false);
	const titleId = useId();

	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				close();
			}
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open, close]);

	return (
		<>
			<button
				type="button"
				className={cn(
					"group block w-full max-w-md cursor-zoom-in border border-black p-0 text-left focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:max-w-none",
					variant === "cover" ? "rounded-2xl" : "rounded-lg",
					className,
				)}
				aria-label="View full-size event poster"
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen(true)}
			>
				<img
					src={src}
					alt={alt}
					className={cn(
						"mx-auto w-full transition-opacity group-hover:opacity-95 md:mx-0",
						variant === "cover"
							? "aspect-square rounded-[calc(1rem-1px)] object-cover"
							: "max-h-[28rem] rounded-[calc(var(--radius-lg)-1px)] object-cover",
					)}
					loading="lazy"
					decoding="async"
				/>
			</button>

			{open ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
					role="dialog"
					aria-modal="true"
					aria-labelledby={titleId}
				>
					<button
						type="button"
						className="absolute inset-0 bg-foreground/70 backdrop-blur-sm"
						aria-label="Close enlarged poster"
						onClick={close}
					/>
					<div className="relative z-10 flex max-h-[min(90vh,56rem)] w-full max-w-4xl flex-col items-end gap-3">
						<button
							type="button"
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"border-black bg-background text-foreground",
							)}
							onClick={close}
						>
							<XIcon data-icon="inline-start" aria-hidden />
							Close
						</button>
						<img
							id={titleId}
							src={src}
							alt={alt}
							className="max-h-[min(85vh,52rem)] w-full rounded-lg border border-black bg-card object-contain shadow-lg"
						/>
					</div>
				</div>
			) : null}
		</>
	);
}