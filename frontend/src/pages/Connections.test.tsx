import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../context/AuthContext";
import Connections from "./Connections";

// Helper function to render with necessary providers
const renderConnections = () => {
	return render(
		<AuthProvider>
			<BrowserRouter>
				<Connections />
			</BrowserRouter>
		</AuthProvider>,
	);
};

describe("Connections Page", () => {
	it("should render the form and an empty connections list", async () => {
		renderConnections();

		// WAIT for loading to finish by finding an element that appears AFTER
		// The "No connections found." text is perfect for this.
		expect(await screen.findByText("No connections found.")).toBeInTheDocument();

		// NOW that loading is done, we can safely find the other elements
		expect(screen.getByRole("heading", { name: "Send Connection Request" })).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter username of user")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Send Request" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Your Connections" })).toBeInTheDocument();
	});

	it("should successfully send a connection request", async () => {
		renderConnections();

		// WAIT for the component to load
		const usernameInput = await screen.findByPlaceholderText("Enter username of user");
		const sendButton = screen.getByRole("button", { name: "Send Request" });

		// Fill out the form
		fireEvent.change(usernameInput, { target: { value: "yoursdev" } });
		fireEvent.click(sendButton);

		// Wait for the success message
		expect(await screen.findByText("Connection request sent!")).toBeInTheDocument();

		// Form should be cleared
		expect(usernameInput).toHaveValue("");
	});

	it("should show an error message on API failure", async () => {
		renderConnections();

		// WAIT for the component to load
		const usernameInput = await screen.findByPlaceholderText("Enter username of user");
		const sendButton = screen.getByRole("button", { name: "Send Request" });

		// Fill out the form with a username we know will fail (from msw handler)
		fireEvent.change(usernameInput, { target: { value: "failuser" } });
		fireEvent.click(sendButton);

		// Wait for the error message
		expect(await screen.findByText("User not found.")).toBeInTheDocument();
	});
});
