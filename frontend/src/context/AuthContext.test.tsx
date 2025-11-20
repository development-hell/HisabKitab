import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

// Test component to consume the context
const TestComponent = () => {
	const { user, login, logout, loading } = useAuth();

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			{user ? (
				<>
					<div data-testid="user-email">{user.email}</div>
					<button onClick={logout}>Logout</button>
				</>
			) : (
				<button onClick={() => login("test@example.com", "password")}>Login</button>
			)}
		</div>
	);
};

const API_URL = "http://127.0.0.1:8000/api";

describe("AuthContext", () => {
	it("should handle login flow successfully", async () => {
		// Override handler to return the user we expect
		server.use(
			http.get(`${API_URL}/users/me/`, () => {
				return HttpResponse.json({
					email: "test@example.com",
					username: "testuser"
				});
			})
		);

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Initial state: Not logged in
		expect(screen.getByText("Login")).toBeInTheDocument();

		// Click login
		fireEvent.click(screen.getByText("Login"));

		// Wait for user to be logged in
		expect(await screen.findByTestId("user-email")).toHaveTextContent("test@example.com");
	});

	it("should handle logout flow", async () => {
		// Mock local storage to simulate existing session
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
			if (key === 'access') return 'fake_token'; // Correct key is 'access'
			return null;
		});

		// Override handler to return the user we expect
		server.use(
			http.get(`${API_URL}/users/me/`, () => {
				return HttpResponse.json({
					email: "test@example.com",
					username: "testuser"
				});
			})
		);

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Should start logged in (because of token)
		expect(await screen.findByTestId("user-email")).toHaveTextContent("test@example.com");

		// Click logout
		fireEvent.click(screen.getByText("Logout"));

		// Should return to login state
		expect(await screen.findByText("Login")).toBeInTheDocument();
		
		vi.restoreAllMocks();
	});

	it("should handle initial load with invalid token", async () => {
		// Mock invalid token
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid_token');
		
		// Override handler to return 401 for this test
		server.use(
			http.get(`${API_URL}/users/me/`, () => {
				return new HttpResponse(null, { status: 401 });
			})
		);

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Should eventually show Login button (meaning loading finished and user is null)
		expect(await screen.findByText("Login")).toBeInTheDocument();
		
		vi.restoreAllMocks();
	});
});
