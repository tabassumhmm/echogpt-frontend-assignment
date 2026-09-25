"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
	mode: ThemeMode;
	resolvedMode: ResolvedTheme;
	setThemeMode: (mode: ThemeMode) => void;
};

const THEME_STORAGE_KEY = "echogpt-demo:v1:theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
	return value === "light" || value === "dark" || value === "system";
}

function readStoredMode(): ThemeMode {
	if (typeof window === "undefined") return "system";
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	return isThemeMode(stored) ? stored : "system";
}

function applyTheme(mode: ThemeMode, systemDark: boolean): ResolvedTheme {
	const resolved: ResolvedTheme =
		mode === "system" ? (systemDark ? "dark" : "light") : mode;
	document.documentElement.classList.toggle("dark", resolved === "dark");
	return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<ThemeMode>("system");
	const [systemDark, setSystemDark] = useState(false);

	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const updateSystemTheme = () => setSystemDark(media.matches);
		const timer = window.setTimeout(() => {
			setMode(readStoredMode());
			updateSystemTheme();
		}, 0);
		media.addEventListener("change", updateSystemTheme);
		return () => {
			window.clearTimeout(timer);
			media.removeEventListener("change", updateSystemTheme);
		};
	}, []);

	useEffect(() => {
		applyTheme(mode, systemDark);
	}, [mode, systemDark]);

	const setThemeMode = useCallback((nextMode: ThemeMode) => {
		setMode(nextMode);
		window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
	}, []);

	const resolvedMode: ResolvedTheme =
		mode === "system" ? (systemDark ? "dark" : "light") : mode;
	const value = useMemo(
		() => ({ mode, resolvedMode, setThemeMode }),
		[mode, resolvedMode, setThemeMode],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used inside ThemeProvider");
	return context;
}

export { THEME_STORAGE_KEY };
