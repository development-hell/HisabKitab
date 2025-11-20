import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import Dashboard from "../Dashboard";
import Login from "./Login";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-router-dom")>();
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const renderLogin = () => {
	render(
		<AuthProvider>
			<MemoryRouter initialEntries={["/login"]}>
				<Routes>
					<Route element={<MainLayout />}>
						<Route path="/login" element={<Login />} />
					</Route>
					{/* We still need a destination for the redirect to test it */}
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</MemoryRouter>
		</AuthProvider>,
	);
};

describe("Login Page", () => {
	it("should render form fields and handle successful login", async () => {
		renderLogin();

		// Wait for the AuthProvider to finish loading
		const submitButton = await screen.findByRole("button", { name: "Sign in" });

		// Fill out the form
		fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "kishan@hisabkitab.com" } });
		fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });

		// Click submit
		fireEvent.click(submitButton);

		// Wait for navigation to be called
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
		});
	});

	it("should show an error message on failed login", async () => {
		renderLogin();

		// Wait for the AuthProvider to finish loading
		const submitButton = await screen.findByRole("button", { name: "Sign in" });

		// Fill out with wrong credentials
		fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "wrong@hisabkitab.com" } });
		fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } });

		fireEvent.click(submitButton);

		// Wait for the error message to appear
		expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
	});
});
