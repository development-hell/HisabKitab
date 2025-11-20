import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import Login from "./Login";
import Register from "./Register";

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-router-dom")>();
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

// Helper to fill the form
const fillForm = () => {
	fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "Yours2" } });
	fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Dev" } });
	fireEvent.change(screen.getByLabelText("Username"), { target: { value: "yours2dev" } });
	fireEvent.change(screen.getByLabelText("Email"), { target: { value: "yours2@hisabkitab.com" } });
	fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } });
	fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password123" } });
};

// Helper to render the component
const renderRegister = () => {
	render(
		<AuthProvider>
			<MemoryRouter initialEntries={["/register"]}>
				<Routes>
					<Route element={<MainLayout />}>
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
					</Route>
				</Routes>
			</MemoryRouter>
		</AuthProvider>,
	);
};

describe("Register Page", () => {
	it("should render all form fields and the submit button", () => {
		renderRegister();
		expect(screen.getByRole("heading", { name: "Create Your Account" })).toBeInTheDocument();
		expect(screen.getByLabelText("First Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
	});

	it("should show an error if passwords do not match", async () => {
		renderRegister();
		fillForm();
		fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "mismatch" } });
		fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
		expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
	});

	it("should successfully register and redirect to login", async () => {
		renderRegister();
		fillForm();
		fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/login?status=success");
		});
	});

	it("should display a backend validation error", async () => {
		renderRegister();
		fillForm();
		// Use the username that our mock handler will reject
		fireEvent.change(screen.getByLabelText("Username"), { target: { value: "kishandev" } });
		fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
		expect(await screen.findByText("This username is already taken.")).toBeInTheDocument();
	});
});
