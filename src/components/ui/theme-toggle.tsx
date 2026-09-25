"use client";

import { MonitorCog, Moon, Sun } from "lucide-react";

import { useTheme, type ThemeMode } from "@/lib/theme";
import { IconButton } from "@/components/ui/icon-button";

const modes: readonly ThemeMode[] = ["light", "dark", "system"];

const labels: Record<ThemeMode, string> = {
	light: "Switch to dark theme",
	dark: "Switch to system theme",
	system: "Switch to light theme",
};

const icons: Record<ThemeMode, typeof Sun> = {
	light: Sun,
	dark: Moon,
	system: MonitorCog,
};

export function ThemeToggle() {
	const { mode, setThemeMode } = useTheme();
	const nextMode = modes[(modes.indexOf(mode) + 1) % modes.length] ?? "system";
	const Icon = icons[mode];

	return (
		<IconButton
			label={`${labels[mode]}. Current theme: ${mode}`}
			variant="ghost"
			onClick={() => setThemeMode(nextMode)}
		>
			<Icon aria-hidden="true" />
		</IconButton>
	);
}
