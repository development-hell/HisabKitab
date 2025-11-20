import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAuth } from "./useAuth";

describe("useAuth Hook", () => {
	it("should throw an error if used outside of AuthProvider", () => {
		// We expect this to throw, so we wrap it in a try/catch or use expect().toThrow()
		// However, React logs the error to console, so we might see a console.error in the output.
		// Suppressing console.error for this specific test is a common pattern if we want a clean output.
		
		const consoleError = console.error;
		console.error = () => {}; // Suppress expected error logging

		expect(() => renderHook(() => useAuth())).toThrow("useAuth must be used within an AuthProvider");

		console.error = consoleError; // Restore
	});
});
