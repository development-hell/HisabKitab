# HisabKitab - Project TODO

This is a living document to track pending development tasks, refactors, and backlog items.

## 1. Completed Tasks

### ☑️ Rename 'Payees' to 'Contacts' in Frontend

- **[x]** Rename `frontend/src/pages/Payees/` directory and files.
- **[x]** Update imports in `main.tsx`.
- **[x]** Update link in `Sidebar.tsx`.
- **[x]** Update redirect in `App.tsx`.
- **[x]** Update internal component code and text.

---

### ☑️ Refine Sidebar UI & UX

**Goal:** Improve the consistency and usability of the main sidebar.

- **[x]** **Reduce Logout Button Visuals:** In `Sidebar.tsx`, change the solid red "Logout" button to a more subtle style.
- **[x]** **Align Collapsed Logout Icon:** In `Sidebar.tsx`, center the "Logout" icon when collapsed.

---

### ☑️ Enhance "Contacts" Page

**Goal:** Make the "Contacts" page more functional and polished.

- **[x]** **Add Contact Actions:** In `ContactList.tsx`, add a header area above the list that includes a Search Bar and "Add New" button.
- **[x]** **Update Mock Data:** In `ContactList.tsx`, remove "lastSeen" mock data and replace with a relevant placeholder.
- **[x]** **Improve Empty State:** In `ContactDetails.tsx`, enhance the "Select a Contact..." message with a centered layout, icon, and better text.

---

### ☑️ Refactor Connection Creation (Backend & Frontend)

**Goal:** Secure the API and streamline the "Send Connection" feature.

- **[x]** **Backend (Security):** Modify `users/views.py`. Change the `list` method in `UserViewSet` to prevent it from leaking all users.
- **[x]** **Backend (Serializer):** Update `connections/serializers.py`. Change the `receiver` field to `SlugRelatedField(slug_field='username', ...)` to accept a username string directly.
- **[x]** **Backend (View):** Override the `create` method in `connections/views.py`. Add logic to check for existing connections (pending, accepted, rejected) before creating a new one.
- **[x]** **Frontend (Refactor):** Update `frontend/src/pages/Connections.tsx`.
  - Remove the `api.get("users/")` call from `handleSend`.
  - Send the `username` directly in the `api.post("connections/", ...)` call.
  - Update the `catch` block to display the detailed error messages from the backend.

---

### ☑️ Create Public Page Layout

**Goal:** Refactor `MainLayout.tsx` to serve as a shared layout for all public-facing pages.

- **[x]** **Refactor `MainLayout.tsx`:** Update the file to include the public `Navbar`, `Footer`, and an `Outlet` for page content.
- **[x]** **Refactor `HomePage.tsx`:** Remove the `Navbar` and `Footer` components.
- **[x]** **Update `main.tsx`:** Wrap the `/home` route (and other future public routes) within the `MainLayout`.
- **[x]** **Move Shared Components:** Move `Navbar.tsx` and `Footer.tsx` from `src/pages/Home/components/` to `src/components/mainLayout/`.
- **[x]** **Update Imports:** Update the import paths in `src/layouts/MainLayout.tsx` to point to the new location.

---

### ☑️ Update Homepage Content

**Goal:** Refine the content and style of the public homepage components.

- **[x]** Refine `Hero.tsx`: Update text to `text-muted` and fix button styles.
- **[x]** Refine `Features.tsx`: Update background to `bg-surface`.
- **[x]** Refine `CTA.tsx`: Update text to `text-muted` and fix button styles.

---

### ☑️ Create User Registration Page

**Goal:** Build the frontend registration page and connect it to the existing `POST /api/users/` endpoint.

- **[x]** **Create File:** Create new page file at `frontend/src/pages/Register.tsx`.
- **[x]** **Build Form:** Add form with fields for name, username, email, and password.
- **[x]** **Add Route:** In `frontend/src/main.tsx`, add the new `/register` route as a standalone route.
- **[x]** **Implement Logic:** Create `handleSubmit` function that calls `POST /api/users/`.
- **[x]** **Add Error Handling:** Add state to display backend validation errors.
- **[x]** **Handle Success:** On success, redirect to `/login` with `?status=success` query param.
- **[x]** **Update `Login.tsx`:** Add `useEffect` to check for success param and display a welcome message.

---

### ☑️ Update Connection Serializers (Backend)

**Goal:** Prepare the `connections` API to return full user data for the frontend lists.

- **[x]** **Backend (Serializer):** Create `NestedUserSerializer` in `users/serializers.py`.
- **[x]** **Backend (Serializer):** Create `UserConnectionListSerializer` in `connections/serializers.py`.
- **[x]** **Backend (View):** Update `UserConnectionViewSet` to use `get_serializer_class` to switch between `List` and `Create` serializers.

---

### ☑️ Update Backend Tests

**Goal:** Fix failing tests and add new ones to cover all recent API changes (Connections, Users, Security).

- **[x]** **Unit Tests:** Review and update unit tests for `users` and `connections` models.
- **[x]** **Integration Tests (Fix):** Fix failing API tests in `backend/connections/tests/`. Update them to post a `username` instead of a `user_id` and check for the new error messages.
- **[x]** **Integration Tests (New):** Write a new API test for the `UserViewSet` security fix (e.g., assert `GET /api/users/` returns 403).
- **[x]** **Integration Tests (New):** Write new API tests for the `UserConnectionViewSet.create` validation logic (e.g., test for 'already connected', 'self-request' errors).

---

### ☑️ Fix Auth Pages UI/UX

**Goal:** Improve the visual aesthetics and layout of Login and Register pages.

- **[x]** **Refactor Login:** Remove layout conflicts, use `card` utility, and improve input styling.
- **[x]** **Refactor Register:** Match Login page design, use `card` utility, and improve input styling.
- **[x]** **Fix Theme Issues:** Fix invalid `rgb` color usage in `MainLayout`, `Footer`, and `ThemeToggle`.
- **[x]** **Update Tailwind Usage:** Switch to cleaner Tailwind v4 utility classes (e.g., `text-foreground`).

---

### ☑️ Create Frontend Tests

**Goal:** Add unit and integration tests to the frontend to ensure components and hooks are working correctly.

- **[x]** **Unit Tests:** Write unit tests for critical components (e.g., `Sidebar.tsx`, `ContactList.tsx`).
- **[x]** **Unit Tests:** Write unit tests for custom hooks (`useAuth`, `useTheme`).
- **[x]** **Integration Tests:** Write integration tests for key user flows:
  - **Login & Register:** Verified with `Login.test.tsx` and `Register.test.tsx`.
  - **Authentication:** Verified `AuthContext` logic with `AuthContext.test.tsx`.
  - **Connections:** Verified "Send Request" flow with `Connections.test.tsx`.

---

### ☑️ Implement Unified "Chat List" API

**Goal:** Create the backend API for `Entities` (e.g., "Grocery Store") and a single endpoint to serve a unified list of all "chat" items (Contacts + Connections) to the frontend.

- **[x]** **Backend (Model):** Create the `Entity` model in a new `entities/models.py` file.
- **[x]** **Backend (Serializers & Views):** Create `entities/serializers.py` and `entities/views.py` with a standard `EntityViewSet` for basic CRUD operations.
- **[x]** **Backend (New Endpoint):** Create a new, read-only `ChatListViewSet` at `GET /api/chat-list/`.
- **[x]** **Frontend (Refactor):** Update `ContactList.tsx` to fetch data from the new `GET /api/chat-list/` endpoint and render the unified list.
- **[x]** **Frontend (Test):** Verified with `ContactList.test.tsx`.

---

### ☑️ Implement Payment Modes

**Goal:** Create the backend API for `Payment Modes` and refactor supported apps to be database-driven.

- **[x]** **Backend (Model):** Create `PaymentMode` and `SupportedApp` models.
- **[x]** **Backend (Migration):** Create data migration to populate `SupportedApp`.
- **[x]** **Backend (API):** Create `PaymentModeViewSet` and `serializers`.
- **[x]** **Backend (Tests):** Add unit tests for models and API.

---

### ☑️ Implement Smart Setup & Wallets

**Goal:** Implement "Digital Wallet" entities and the "Smart Setup" flow where a wallet is created specifically for a supported Payment Mode.

- **[x]** **Backend (Model):** Add `WALLET` to `ENTITY_TYPES`.
- **[x]** **Backend (Model):** Update `Payment_Mode` to allow unlinked modes (nullable `linked_entity`).
- **[x]** **Backend (API):** Implement `POST /api/payment-modes/{id}/create-wallet/` endpoint.
- **[x]** **Backend (Tests):** Add unit tests for wallet creation logic.

---

### ☑️ Implement Entity Balance

**Goal:** Store `current_balance` directly on the `Entity` model to support Opening Balances without creating "System" transactions.

- **[x]** **SRS:** Updated to remove "Calculated Balance" and "SYSTEM Entity" rules.
- **[x]** **Backend (Model):** Add `current_balance` field to `Entity` model.
- **[x]** **Backend (Serializer):** Update `EntitySerializer`.
- **[x]** **Backend (Tests):** Add unit tests for balance persistence.

---

### ☑️ Implement Accounts Page

**Goal:** Create a frontend page to manage "Accounts" (Bank Accounts, Cash, Digital Wallets) with "Smart Setup" for wallets.

- **[x]** **Backend:** Update `PaymentModeSerializer` to include `supports_wallet`.
- **[x]** **Frontend:** Create `AccountsPage`, `AccountList`, and `AddAccountModal`.
- **[x]** **Frontend:** Implement "Smart Setup" logic (filter payment modes).
- **[x]** **Frontend:** Add `/accounts` route and Sidebar link.

---

### ☑️ Implement Categories Page

**Goal:** Create a frontend page to manage "Categories" (e.g., Food, Transport).

- **[x]** **Frontend:** Create `CategoriesPage`, `CategoryList`, and `AddCategoryModal`.
- **[x]** **Frontend:** Add `/categories` route and Sidebar link.

---

## 2. Pending Code Changes (To-Do)







## 3. Future Tasks (Backlog)

New features and ideas to be prioritized and worked on next.

- _(Ready for your next task!)_
