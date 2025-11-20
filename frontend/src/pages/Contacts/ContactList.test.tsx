import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ContactList from "./ContactList";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

const API_URL = "http://127.0.0.1:8000/api";

describe("ContactList Component", () => {
	it("should render loading state initially", () => {
		render(<ContactList onSelect={vi.fn()} selected={null} />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("should render contacts after fetch", async () => {
		// Mock the API response
		server.use(
			http.get(`${API_URL}/chat-list/`, () => {
				return HttpResponse.json([
					{
						id: "conn_1",
						name: "John Doe",
						type: "USER",
						status: "online",
						avatar: null,
						last_message: "Hello",
						updated_at: "2023-01-01T12:00:00Z"
					},
					{
						id: "ent_1",
						name: "Grocery Store",
						type: "ENTITY",
						status: null,
						avatar: null,
						last_message: null,
						updated_at: "2023-01-02T12:00:00Z"
					}
				]);
			})
		);

		render(<ContactList onSelect={vi.fn()} selected={null} />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByText("Grocery Store")).toBeInTheDocument();
		});
	});

	it("should handle selection", async () => {
		const onSelect = vi.fn();
		
		server.use(
			http.get(`${API_URL}/chat-list/`, () => {
				return HttpResponse.json([
					{
						id: "conn_1",
						name: "John Doe",
						type: "USER",
						status: "online",
						avatar: null,
						last_message: "Hello",
						updated_at: "2023-01-01T12:00:00Z"
					}
				]);
			})
		);

		render(<ContactList onSelect={onSelect} selected={null} />);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText("John Doe"));
		expect(onSelect).toHaveBeenCalledWith("conn_1");
	});

	it("should handle error state", async () => {
		server.use(
			http.get(`${API_URL}/chat-list/`, () => {
				return new HttpResponse(null, { status: 500 });
			})
		);

		render(<ContactList onSelect={vi.fn()} selected={null} />);

		await waitFor(() => {
			expect(screen.getByText("Failed to load contacts.")).toBeInTheDocument();
		});
	});
});
