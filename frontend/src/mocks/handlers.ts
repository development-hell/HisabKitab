import { http, HttpResponse } from "msw";

// Define the base URL from your axios config
const API_BASE_URL = "http://127.0.0.1:8000/api/";

// Mock user data
const MOCK_USER = {
	user_id: 1,
	email: "kishan@hisabkitab.com",
	username: "kishandev",
	first_name: "Kishan",
	last_name: "Dev",
	phone_number: "9876543210",
};

export const handlers = [
	// Mock for: GET /api/users/me/
	http.get(`${API_BASE_URL}users/me/`, () => {
		return HttpResponse.json(MOCK_USER);
	}),

	// Mock for: GET /api/connections/
	http.get(`${API_BASE_URL}connections/`, () => {
		return HttpResponse.json([]);
	}),

	// Mock for: POST /api/connections/
	http.post(`${API_BASE_URL}connections/`, async ({ request }) => {
		const body = (await request.json()) as any;

		if (body.receiver === "failuser") {
			return HttpResponse.json({ detail: "User not found." }, { status: 400 });
		}
		return HttpResponse.json({ connection_id: 123, ...body, status: "pending" }, { status: 201 });
	}),

	// Mock for: POST /api/users/ (Registration)
	http.post(`${API_BASE_URL}users/`, async ({ request }) => {
		const body = (await request.json()) as any;
		if (body.username === "kishandev") {
			return HttpResponse.json({ username: ["This username is already taken."] }, { status: 400 });
		}
		return HttpResponse.json({ ...body, user_id: 2 }, { status: 201 });
	}),

	// Mock for: POST /api/token/ (Login)
	http.post(`${API_BASE_URL}token/`, async ({ request }) => {
		const body = (await request.json()) as any;
		if (body.email === "wrong@hisabkitab.com") {
			return HttpResponse.json({ detail: "Invalid credentials" }, { status: 401 });
		}
		return HttpResponse.json({ access: "mock-access", refresh: "mock-refresh" });
	}),

	// --- THE FIX IS HERE ---
	// Mock for: PATCH /api/users/me/ (Profile Save)
	http.patch(`${API_BASE_URL}users/me/`, async ({ request }) => {
		// WORKAROUND: request.formData() hangs in some JSDOM environments.
		// We read the raw text and check for the boundary-encoded value.
		const text = await request.text();

		// Check for validation error scenario
		// In multipart/form-data, the value 'yoursdev' will appear in the body
		if (text.includes("yoursdev")) {
			return HttpResponse.json({ username: ["This username is already taken."] }, { status: 400 });
		}

		// Success scenario
		return HttpResponse.json({
			...MOCK_USER,
			first_name: "Kishan (Updated)", // Just return the expected updated value for the test
		});
	}),
];
