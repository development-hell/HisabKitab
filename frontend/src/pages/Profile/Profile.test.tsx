import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import * as authLib from "../../lib/auth";
import Profile from "./Profile";

// Mock user data
const MOCK_USER = {
	user_id: 1,
	email: "kishan@hisabkitab.com",
	username: "kishandev",
	first_name: "Kishan",
	last_name: "Dev",
	phone_number: "9876543210",
};

// Mock the getSavedUser function
vi.mock("../../lib/auth", async (importOriginal) => {
	const actual = await importOriginal<typeof authLib>();
	return {
		...actual,
		getSavedUser: vi.fn(() => MOCK_USER),
		getAccessToken: vi.fn(() => "mock-token"),
	};
});

const renderProfile = () => {
	render(
		<AuthProvider>
			<BrowserRouter>
				<Profile />
			</BrowserRouter>
		</AuthProvider>,
	);
};

describe("Profile Page", () => {
	it("should load and display user data, then allow editing", async () => {
		renderProfile();

		expect(screen.getByText("kishan@hisabkitab.com")).toBeInTheDocument();

		const editButton = screen.getByRole("button", { name: "Edit Profile" });
		fireEvent.click(editButton);

		const updatedFirstName = "Kishan (Updated)";
		// --- THIS IS THE FIX ---
		// Now we select by the accessible label, not the display value
		fireEvent.change(screen.getByLabelText("First Name"), { target: { value: updatedFirstName } });

		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(await screen.findByText("✅ Profile updated successfully!")).toBeInTheDocument();
	});

	it("should show a validation error on save", async () => {
		renderProfile();

		const editButton = screen.getByRole("button", { name: "Edit Profile" });
		fireEvent.click(editButton);

		// --- THIS IS THE FIX ---
		// Now we select by the accessible label
		fireEvent.change(screen.getByLabelText("Username"), { target: { value: "yoursdev" } });

		fireEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(await screen.findByText("This username is already taken.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
	});
});
