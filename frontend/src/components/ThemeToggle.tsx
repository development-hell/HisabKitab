import { Moon, Sun } from "lucide-react";
import useTheme from "../hooks/useTheme";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		if (theme === "dark") setTheme("light");
		else if (theme === "light") setTheme("dark");
		else {
			// if system, follow opposite of current system preference
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			setTheme(prefersDark ? "light" : "dark");
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-md bg-[rgb(var(--color-card))] hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200"
			title={`Current: ${theme}`}
		>
			{theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
		</button>
	);
}
