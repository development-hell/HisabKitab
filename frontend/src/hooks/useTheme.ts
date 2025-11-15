import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "system");

	// Helper: apply the chosen theme to <html>
	const applyTheme = (mode: Theme) => {
		const root = document.documentElement;
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const isDark = mode === "dark" || (mode === "system" && prefersDark);

		// 🔁 Update class and storage
		root.classList.toggle("dark", isDark);
		localStorage.setItem("theme", mode);
	};

	// Apply when user manually changes the theme
	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	// Auto-update when system theme changes (if "system" mode selected)
	useEffect(() => {
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = (e: MediaQueryListEvent) => {
			document.documentElement.classList.toggle("dark", e.matches);
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [theme]);

	return { theme, setTheme };
}
