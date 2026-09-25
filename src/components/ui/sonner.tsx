"use client";

import type { CSSProperties } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
	CircleCheckIcon,
	InfoIcon,
	TriangleAlertIcon,
	OctagonXIcon,
	Loader2Icon,
} from "lucide-react";

type ToastStyle = CSSProperties & {
	readonly "--normal-bg": string;
	readonly "--normal-text": string;
	readonly "--normal-border": string;
	readonly "--border-radius": string;
};

const toastStyle: ToastStyle = {
	"--normal-bg": "var(--popover)",
	"--normal-text": "var(--popover-foreground)",
	"--normal-border": "var(--border)",
	"--border-radius": "var(--radius)",
};

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();
	const resolvedTheme =
		theme === "light" || theme === "dark" || theme === "system"
			? theme
			: "system";

	return (
		<Sonner
			theme={resolvedTheme}
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			style={toastStyle}
			toastOptions={{
				classNames: {
					toast: "cn-toast",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
