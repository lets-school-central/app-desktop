import { Progress } from "$/components/ui/progress";
import { cn } from "$/lib/utils";

export type LoadingScreenProps = {
	progress?: number | "full";
	text?: string;
	variant?: "primary" | "success" | "warning" | "error";
};

const defaultProps = {
	progress: 100,
	text: "Loading...",
	variant: "primary",
} satisfies LoadingScreenProps;

export default function LoadingScreen(props: LoadingScreenProps) {
	const { progress, variant, text } = { ...defaultProps, ...props };

	return (
		<div className="flex flex-col gap-0.5">
			<Progress
				value={progress === "full" ? 100 : progress}
				className={cn(
					variant === "primary" && "bg-primary/20 [&>div]:bg-primary",
					variant === "success" && "bg-success/20 [&>div]:bg-success",
					variant === "warning" && "bg-warning/20 [&>div]:bg-warning",
					variant === "error" && "bg-destructive/20 [&>div]:bg-destructive",
				)}
			/>
			<p className={cn(
				"text-left",
				variant === "primary" && "text-primary",
				variant === "error" && "text-destructive",
			)}>
				{text}
			</p>
		</div>
	);
}
