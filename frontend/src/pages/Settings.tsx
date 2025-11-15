import useTheme from "../hooks/useTheme";

export default function Settings() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="min-h-screen bg-background text-foreground p-6">
			<h1 className="text-3xl font-semibold mb-8">Settings</h1>

			<div className="bg-surface text-surface-foreground rounded-xl shadow-smooth p-6 max-w-md border border-base">
				<label htmlFor="theme" className="block text-sm font-medium mb-2">
					Theme
				</label>

				<select
					id="theme"
					value={theme}
					onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
					className="w-full border border-base rounded-md px-3 py-2 bg-transparent focus:ring-2 focus:ring-primary"
				>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
					<option value="system">System Default</option>
				</select>

				<p className="text-xs text-muted mt-2">The “System Default” option follows your device’s appearance setting.</p>
			</div>
		</div>
	);
}
