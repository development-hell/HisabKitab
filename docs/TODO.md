# HisabKitab - Project TODO

This is a living document to track pending development tasks, refactors, and backlog items.

## 1. Completed Tasks

### ☑️ Rename 'Payees' to 'Contacts' in Frontend
* **[x]** Rename `frontend/src/pages/Payees/` directory and files.
* **[x]** Update imports in `main.tsx`.
* **[x]** Update link in `Sidebar.tsx`.
* **[x]** Update redirect in `App.tsx`.
* **[x]** Update internal component code and text.

---

### ☑️ Refine Sidebar UI & UX

**Goal:** Improve the consistency and usability of the main sidebar.

* **[x]** **Reduce Logout Button Visuals:** In `Sidebar.tsx`, change the solid red "Logout" button to a more subtle style.
* **[x]** **Align Collapsed Logout Icon:** In `Sidebar.tsx`, center the "Logout" icon when collapsed.

---

### ☑️ Enhance "Contacts" Page

**Goal:** Make the "Contacts" page more functional and polished.

* **[x]** **Add Contact Actions:** In `ContactList.tsx`, add a header area above the list that includes a Search Bar and "Add New" button.
* **[x]** **Update Mock Data:** In `ContactList.tsx`, remove "lastSeen" mock data and replace with a relevant placeholder.
* **[x]** **Improve Empty State:** In `ContactDetails.tsx`, enhance the "Select a Contact..." message with a centered layout, icon, and better text.

---

### ☑️ Refactor Connection Creation (Backend & Frontend)

**Goal:** Secure the API and streamline the "Send Connection" feature.

* **[x]** **Backend (Security):** Modify `users/views.py`. Change the `list` method in `UserViewSet` to prevent it from leaking all users.
* **[x]** **Backend (Serializer):** Update `connections/serializers.py`. Change the `receiver` field to `SlugRelatedField(slug_field='username', ...)` to accept a username string directly.
* **[x]** **Backend (View):** Override the `create` method in `connections/views.py`. Add logic to check for existing connections (pending, accepted, rejected) before creating a new one.
* **[x]** **Frontend (Refactor):** Update `frontend/src/pages/Connections.tsx`.
    * Remove the `api.get("users/")` call from `handleSend`.
    * Send the `username` directly in the `api.post("connections/", ...)` call.
    * Update the `catch` block to display the detailed error messages from the backend.

---

### ☑️ Create Public Page Layout

**Goal:** Refactor `MainLayout.tsx` to serve as a shared layout for all public-facing pages.

* **[x]** **Refactor `MainLayout.tsx`:** Update the file to include the public `Navbar`, `Footer`, and an `Outlet` for page content.
* **[x]** **Refactor `HomePage.tsx`:** Remove the `Navbar` and `Footer` components.
* **[x]** **Update `main.tsx`:** Wrap the `/home` route (and other future public routes) within the `MainLayout`.
* **[x]** **Move Shared Components:** Move `Navbar.tsx` and `Footer.tsx` from `src/pages/Home/components/` to `src/components/mainLayout/`.
* **[x]** **Update Imports:** Update the import paths in `src/layouts/MainLayout.tsx` to point to the new location.

---

### ☑️ Update Homepage Content

**Goal:** Refine the content and style of the public homepage components.

* **[x]** Refine `Hero.tsx`: Update text to `text-muted` and fix button styles.
* **[x]** Refine `Features.tsx`: Update background to `bg-surface`.
* **[x]** Refine `CTA.tsx`: Update text to `text-muted` and fix button styles.

---

### ☑️ Create User Registration Page

**Goal:** Build the frontend registration page and connect it to the existing `POST /api/users/` endpoint.

* **[x]** **Create File:** Create new page file at `frontend/src/pages/Register.tsx`.
* **[x]** **Build Form:** Add form with fields for name, username, email, and password.
* **[x]** **Add Route:** In `frontend/src/main.tsx`, add the new `/register` route as a standalone route.
* **[x]** **Implement Logic:** Create `handleSubmit` function that calls `POST /api/users/`.
* **[x]** **Add Error Handling:** Add state to display backend validation errors.
* **[x]** **Handle Success:** On success, redirect to `/login` with `?status=success` query param.
* **[x]** **Update `Login.tsx`:** Add `useEffect` to check for success param and display a welcome message.

---

## 2. Pending Code Changes (To-Do)

### ◻️ Unify "Contacts" List (Show Connections)

**Goal:** Update the "Contacts" page to display both `External Contacts` (from mock data) and `User Connections` (from the API), fulfilling the "Chat-Centric UI" vision.

* **[ ]** **Backend (Serializer):** Update `connections/serializers.py`. The `GET /api/connections/` response needs to include the *full user details* for the `requester` and `receiver`, not just their IDs/usernames. (e.g., use a nested `UserSerializer`). This is needed to display their name in the list.
* **[ ]** **Frontend (Data Fetching):** In `ContactList.tsx`, add a `useEffect` to fetch from `api.get("connections/")`.
* **[ ]** **Frontend (Merge Logic):** In `ContactList.tsx`, create a new state variable (e.g., `combinedList`). Merge the `mockContacts` with the results from the `connections/` API.
* **[ ]** **Frontend (Render):** Update the `map` function to render the `combinedList`, differentiating between a `Contact` (e.g., "Grocery Store") and a `Connection` (e.g., "Kishan Dev").

---

## 3. Future Tasks (Backlog)

New features and ideas to be prioritized and worked on next.

* *(Ready for your next task!)*