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

## 2. Pending Code Changes (To-Do)

### ◻️ Create User Registration Page

**Goal:** Build the frontend registration page and connect it to the existing `POST /api/users/` endpoint.

* **[ ]** **Create File:** Create a new page file at `frontend/src/pages/Register.tsx`.
* **[ ]** **Build Form:** Add a form to the new page with fields for:
    * First Name
    * Last Name
    * Username
    * Email
    * Password
* **[ ]** **Add Route:** In `frontend/src/main.tsx`, add the new `/register` route as a standalone route (like `/login`).
* **[ ]** **Implement Logic:** Create a `handleSubmit` function that calls the `POST /api/users/` endpoint with the form data.
* **[ ]** **Add Error Handling:** Add state to display backend validation errors (e.g., "This username is already taken.").
* **[ ]** **Handle Success:** On successful registration, redirect the user to the `/login` page with a success message.

---

## 3. Future Tasks (Backlog)

New features and ideas to be prioritized and worked on next.

* *(Ready for your next task!)*