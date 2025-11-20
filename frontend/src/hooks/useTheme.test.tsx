import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import useTheme from "./useTheme";

describe("useTheme Hook", () => {
	// Clear localStorage after each test
	afterEach(() => {
		localStorage.clear();
		document.documentElement.className = "";
	});

	it('should default to "system" theme', () => {
		const { result } = renderHook(() => useTheme());
		expect(result.current.theme).toBe("system");
	});

	it("should load theme from localStorage", () => {
		localStorage.setItem("theme", "dark");
		const { result } = renderHook(() => useTheme());
		expect(result.current.theme).toBe("dark");
	});

	it("should change theme and update localStorage", () => {
		const { result } = renderHook(() => useTheme());

		act(() => {
			result.current.setTheme("light");
		});

		expect(result.current.theme).toBe("light");
		expect(localStorage.getItem("theme")).toBe("light");
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("should apply dark theme", () => {
		const { result } = renderHook(() => useTheme());

		act(() => {
			result.current.setTheme("dark");
		});

		expect(result.current.theme).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it('should respect system preference when theme is "system"', () => {
		// Mock window.matchMedia
		vi.stubGlobal("matchMedia", (query: string) => ({
			matches: true, // Mocking "prefers-color-scheme: dark"
			media: query,
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}));

		renderHook(() => useTheme());
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});
});
