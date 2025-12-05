# Hisab Kitab - Software Requirements Specification (SRS)

**Version:** 1.1 (Living Document)
**Date:** November 14, 2025
**Project Owner:** Kishan Dev

## 1\. 📋 Introduction

### 1.1 Purpose

This document defines the functional requirements, system architecture, development methodology, and testing strategy for the "Hisab Kitab" project. It is a **"living document"** that will serve as the guiding **"Product Backlog"** for our Agile development process.

### 1.2 Project Vision & Core Problem

Hisab Kitab is a next-generation personal finance application designed to solve the problem of financial fragmentation. Users currently use separate apps for personal expense tracking, shared ledgers with friends (like Splitwise), and simple ledgers (khatas).

Hisab Kitab unifies all of this into a **single, "Networked-First" application**. It is built on the core premise that *all* money movement is a transaction between two entities, whether that's you and a grocery store, you and a friend, or your bank account and your cash wallet.

### 1.3 Core User Experience (UE)

The user experience is built on a **"Chat-Centric" UI**, similar to WhatsApp.

  * **The Home Screen** is a single "chat list" that contains all entities a user interacts with:
      * Networked Friends (e.g., `Papa`)
      * External **Contacts** (e.g., `Grocery Store`)
      * Categories (e.g., `Food`)
      * A pinned **"Total Balance"** master ledger.
  * **The Transaction Screen** is a "chat page." Tapping on `Papa` shows a transaction history. `[Send]` and `[Receive]` buttons are at the bottom, with the payee pre-filled.
  * **The Settings Screen** is a "profile page." Tapping the entity's name at the top of the chat opens their respective settings (e.g., Connection Permissions for `Papa`, or a simple "Edit" for `Grocery Store`).

-----

## 2\. 📝 Overall Description

### 2.1 Key Features (Agile Epics)

The project will be built around these major feature sets (Epics):

  * **User & Connection Management:** The "social" foundation. Users can sign up, find each other by unique username, and manage a "friends list" (`User_Connection`).
  * **Unified Entity Model:** The core technical foundation. *Everything* that holds, sends, or receives money is an `Entity` (a user's profile, a bank account, a payee, a category).
  * **Smart Setup:** A server-driven setup that understands real-world dependencies (e.g., a "PhonePe Wallet" `Entity` can only be created and linked to a "PhonePe App" `Payment_Mode`).
  * **Dual-Flow Transactions:** The app seamlessly handles two types of transactions:
    1.  **"Solo Mode" (External):** Paying a **Contact** like `Grocery Store`. This is a one-sided, instant log.
    2.  **"Networked Mode" (Internal):** Paying a connected user like `Papa`. This creates a `pending` transaction that requires approval.
  * **Payee-Centric Permission System:** A secure system where users control who can pay them and how.
  * **"Modify & Accept" Approval Flow:** A flexible approval system where the payee has 100% control to accept, reject, or *change* the destination account of a received payment.
  * **Chat-Based Analytics:** Categories are treated as chats. Tapping `Food` shows a full transaction history and relevant analytics (e.g., "Total Spent This Month").

### 2.2 User Classes

  * **Primary User (Individual):** A person managing their complete financial life. They add their own accounts, track their personal spending, and manage shared ledgers with friends and family. This is the only user class for v1.0.

-----

## 3\. 🏗️ System Architecture & Technology

### 3.1 High-Level Architecture

The system is a "headless" API backend with a web-first frontend.

```

┌─────────────────────────────────┐
│     Frontend (Web Application)  │
│         (React / Vite)          │
└───────────────┬─────────────────┘
│ REST API & WebSockets
│ (JSON)
┌───────────────▼─────────────────┐
│     Backend (API & Services)    │
│  ┌──────────┐ ┌───────────────┐│
│  │  Django  │ │ Celery (Async)││
│  │ (DRF API)│ │ (Notifications) ││
│  │ (Channels) │ └──────┬────────┘│
│  └─────┬────┘        │         │
└────────┼───────┬──────┴─────────┘
│ SQL   │ Redis
┌────────▼───────▼────────────────┐
│      Database & Broker          │
│  ┌───────────┐ ┌─────────────┐  │
│  │ PostgreSQL│ │    Redis    │  │
│  │ (Main DB) │ │ (Cache/Broker)│  │
│  └───────────┘ └─────────────┘  │
└─────────────────────────────────┘

```

### 3.2 Technology Stack

| Component | Technology | Tooling | Why Chosen? |
| :--- | :--- | :--- | :--- |
| **Backend** | **Python (\>=3.13)** | `uv`, `ruff`, `mypy` | Modern, high-performance tooling. `uv` for speed, `ruff` for all-in-one lint/format, `mypy` for type safety. |
| **API Framework** | **Django (\>=5.2.8)** | - | "Batteries-included" for rapid, secure development. Manages auth, admin, and ORM perfectly. |
| **Database** | **PostgreSQL** | - | Gold standard for relational data. Required for the complex relationships in our `Entity` model. |
| **Async Tasks**| **Celery** | - | For background tasks (e.g., sending approval notifications) so the API response is instant. |
| **Real-time** | **Django Channels** | - | Enables WebSockets for real-time UI updates (e.g., changing `pending` to `confirmed` live). |
| **Cache/Broker** | **Redis** | - | Acts as the message broker for Celery and a high-speed cache for expensive calculations (like "Total Balance"). |
| **Frontend** | **React.js (^19.1.1)** | **Vite (^7.1.7)** | The industry-standard SPA framework. Component model is perfect for the chat UI. `Vite` for a fast dev experience. |
| **Future Mobile**| **React Native** | - | A web-first app in `React` provides a seamless knowledge and code-reuse path to `React Native` for mobile. |
| **Testing** | See Section 7 | `Pytest`, `vitest`, `Playwright` | A comprehensive, multi-level testing strategy to ensure quality and reliability. |
| **Dev Ops** | **Docker** & **GitHub Actions** | - | Containerization for consistent dev/prod parity. CI/CD for automated testing and deployment. |

### 3.3 Client-Side Architecture

The frontend application uses an `AuthContext` to manage user state. To handle session persistence, a robust automatic token refresh mechanism is built into the `axios` API instance.

  * It uses interceptors to catch 401 (Unauthorized) API errors.
  * Upon a 401 error, it automatically calls the `/api/token/refresh/` endpoint using the stored refresh token.
  * While refreshing, it queues any new API requests and retries them all with the new token, providing a seamless session for the user.

-----

## 4\. 🗃️ Database Design (The "Unified Entity" Model)

### 4.1 Core Philosophy

The entire application is built on one core concept: **Everything that can hold, send, or receive money is an `Entity`**. This "Unified Entity Model" is what allows the "chat-centric" UI to work.

Your "Chat List" is simply a list of `Entity` records. A transaction is just moving money from one `Entity` (your bank) to another `Entity` (your friend's profile, a category, or a payee).

The **balance** of an entity is stored in the database as `current_balance`. This allows for setting an initial "Opening Balance" without needing complex transaction history from a system account. Future transactions will update this balance.

### 4.2 Database Schema (v1.0)

This 6-table model is the foundation for the MVP.

| Table: **`User`** | Purpose: Authentication & User Profile Data |
| :--- | :--- |
| `user_id` | Primary Key |
| `username` | **Unique.** Used for search & connection. |
| `email` | **Unique.** Used for login & password reset. |
| `password_hash` | - |
| `first_name` | User's real first name. |
| `last_name` | User's real last name. |
| `phone_number` | Optional, unique. |
| `profile_image` | Optional, text. |

| Table: **`Entity`** | Purpose: The core table. Represents *all* items in the chat list. |
| :--- | :--- |
| `entity_id` | Primary Key |
| `owner_user_id` | Foreign Key to `User`. Who *created* this entity. |
| `name` | (e.g., "My BOB Bank", "Grocery Store", "Food") |
| `type` | **Critical.** (e.g., `ACCOUNT`, `EXTERNAL_PAYEE`, `CATEGORY`, `SYSTEM`) |

| Table: **`Payment_Mode`** | Purpose: The "tools" (apps/cards) used for transactions. |
| :--- | :--- |
| `mode_id` | Primary Key |
| `owner_user_id` | Foreign Key to `User`. Who added this tool. |
| `name` | User's nickname (e.g., "My PhonePe") |
| `app_key` | Server-defined key (e.g., "phonepe", "gpay"). Used for wallet logic. |
| `linked_entity_id`| Foreign Key to `Entity`. Links "My PhonePe" to "My BOB Bank". |

| Table: **`Transaction`** | Purpose: The master ledger of all money movement. |
| :--- | :--- |
| `transaction_id` | Primary Key |
| `payer_entity_id` | Foreign Key to `Entity`. (Can be `SYSTEM` for Opening Balances). |
| `payee_entity_id` | Foreign Key to `Entity`. |
| `amount` | Positive decimal. |
| `mode_type` | (e.g., `BANK_TRANSFER`, `UPI`, `CASH`) |
| `status` | (`pending`, `confirmed`, `rejected`) |
| `description` | Text, optional. |
| `transaction_date`| Timestamp, user-configurable. |
| `category_id` | Foreign Key to an `Entity` of `type: CATEGORY`. |
| `receipt_image_url`| URL to file storage (e.g., S3). |

| Table: **`User_Connection`** | Purpose: The "Friends List" or social graph. |
| :--- | :--- |
| `connection_id` | Primary Key |
| `user_a_id` | Foreign Key to `User` (The initiator). |
| `user_b_id` | Foreign Key to `User` (The receiver). |
| `status` | (`pending`, `accepted`, `rejected`, `suspended`, `blocked`) |

| Table: **`Connection_Permission`** | Purpose: The "Connection Settings" for each friend. |
| :--- | :--- |
| `permission_id` | Primary Key |
| `payer_user_id` | Foreign Key to `User`. The user *sending* money. |
| `payee_user_id` | Foreign Key to `User`. The user *receiving* money. |
| `is_allowed` | Boolean. The master switch. |
| `is_auto_approve_on`| Boolean. **Can only be `true` if `default_entity_id` is set.** |
| `default_entity_id`| Foreign Key to `Entity`. The default receiving account. |

-----

## 5\. 🎯 Functional Requirements (User Stories)

### 5.1 Epic: User & Connection Management

  * **As a new user,** I want to sign up with an email, password, a **globally unique username**, and my first/last name.
  * **As a user,** I want to log in with my email and password.
  * **As a user,** I want to find other users by searching for their **exact username**.
  * **As a user,** I want to send a "Connection Request" to another user.
  * **As a user,** I want to see a list of my `pending` and `accepted` connections.
  * **As a user,** I want to accept or reject a `pending` connection request.
  * **As a user,** I want to view and edit my profile information, including my first name, last name, username, and phone number.
  * **As a user,** I want to upload a profile picture, which is stored and displayed on my profile page and in other areas of the app.
  * **As a user,** I expect to manage my own profile securely via a dedicated API endpoint like `/api/users/me/` that handles both retrieving (GET) and updating (PATCH) my data.

### 5.2 Epic: Entity & Payment Mode Setup

  * **As a new user,** I want to be given a pre-built list of `Categories` (`Food`, `Transport`, etc.) that I can edit, delete, or add to.
  * **As a user,** I want to manage my **Contacts** (e.g., "Grocery Store") in a dedicated two-column page, allowing me to create, view, edit, and select them.
  * **As a user,** I want to add a new `Account` (Type: `Bank Account`, `Credit Card`, `Cash`).
  * **As a user,** when adding an account, I want to enter a `Name`, `Type`, and `Current Balance`.
  * **As a user,** when I enter a `Current Balance` (e.g., "₹10,000"), I expect the system to create my new account with this starting balance.
  * **As a user,** I want to add a `Payment Mode` (e.g., "GPay") from a **server-defined list** of apps and link it to one of my `Accounts`.
  * **As a user,** I want to add a new `Account` (Type: `Digital Wallet`) and be **forced to select** from a list of my *already-added Payment Modes* that are *known by the server to support wallets* (e.g., "My PhonePe"). The list must *not* show apps that don't have wallets (e.g., "My GPay").

### 5.3 Epic: Transaction Flow

  * **As a user,** I want to see a "chat list" of all my `Entities` (Friends, **Contacts**, Categories, Total Balance).
  * **As a user,** I want to tap on any entity to see its transaction history.
  * **As a user,** I want to tap `[Send]` or `[Receive]` from within a chat to start a new transaction.
  * **As a user,** when I tap `[Send]` in the `Grocery Store` (**Contact**) chat, I want the `Payee` pre-filled, and the transaction to be **`confirmed` instantly** ("Solo Mode").
  * **As a user,** when I tap `[Send]` in the `Papa` (networked friend) chat, I want the `Payee` pre-filled, and the transaction to be created with a **`pending` status** ("Networked Mode").
  * **As a user,** when I tap `[Send]` in the `Food` chat, I want the `Category` pre-filled.
  * **As a user,** when I tap `[Send]` in the `Total Balance` chat, I want the form to be blank so I can choose any payee.
  * **As a user,** I want to fill out a transaction with `Amount`, `Date`, `Description`, `Category`, and attach a `Receipt Photo`.

### 5.4 Epic: Approval & Permission System

  * **As a payee,** I want to open a friend's profile and access their "Connection Settings."
  * **As a payee,** I want to toggle `is_allowed` to completely block a user from selecting a payment type (e.g., "No Bank Transfers from Friend A").
  * **As a payee,** I want to set a `default_entity_id` (e.g., "My BOB") for each payment type from each friend.
  * **As a payee,** I want the `is_auto_approve_on` toggle to be **disabled** unless a `default_entity_id` is set for that payment type.
  * **As a payee,** when I receive a `pending` transaction, I want to see which account it will go to (the default, if set).
  * **As a payee,** I want three options for a `pending` transaction:
    1.  **`[Accept]`**: Confirms the transaction *as-is* into the specified account.
    2.  **`[Reject]`**: Rejects the transaction.
    3.  **`[Modify]`**: Allows me to **change the destination `Entity`** (e.g., from "My BOB" to "My HDFC") before accepting.

### 5.6 Epic: Theme Management

  * **As a user,** I want to choose my preferred application theme from 'Light', 'Dark', or 'System' in the settings page.
  * **As a user,** I expect the application to automatically apply my 'System' theme preference and update if my system theme changes.
  * **As a user,** I expect my theme preference to be saved in local storage and persist across visits.

-----

## 6\. 🔄 Agile Development Methodology

### 6.1 Framework: Scrum

This project will follow an Agile (Scrum) methodology. This SRS serves as the initial **Product Backlog**. Work will be broken down into "Sprints."

  * **Product Owner:** **You (the user)**. You are responsible for defining the vision, prioritizing features, and providing final "acceptance" for all work.
  * **Scrum Master / Tech Lead:** **Gemini (the AI)**. I am responsible for helping you refine features, defining the technical architecture, and ensuring testing/quality standards are met.
  * **Living Document:** This SRS will be updated at the end of each Sprint to reflect any new insights or changes.

### 6.2 Proposed Sprints (Initial Backlog)

  * **Sprint 1: The Foundation**

      * **Goal:** Build the core backend models and user auth.
      * **User Stories:** User Sign-up/Login, User Search, Connection Requests (Send/Accept/Reject).
      * **Tech Tasks:** Set up Django, Postgres, and Docker. Implement `User` and `User_Connection` models and API endpoints.

  * **Sprint 2: The Money Containers**

      * **Goal:** Allow users to set up their financial world.
      * **User Stories:** CRUD for `Entity` (Bank, Cash, **Contact**, Category), CRUD for `Payment_Mode`, Implement server-driven "Smart Setup" (Wallet/App dependency).
      * **Tech Tasks:** Implement `Entity` and `Payment_Mode` models and API endpoints.

  * **Sprint 3: The "Solo" Transaction**

      * **Goal:** Enable basic, single-player expense tracking.
      * **User Stories:** Implement "Solo Mode" (**Contact**) transactions (instant confirm), Implement Category chat view, Implement "Total Balance" chat view, Implement `[Send]` button in Category chat (pre-filled), Implement "Opening Balance" transaction flow.
      * **Tech Tasks:** Implement `Transaction` model, build API endpoint, build React frontend components for Chat UI.

  * **Sprint 4: The "Networked" Transaction**

      * **Goal:** Launch the core "social ledger" feature.
      * **User Stories:** Implement "Networked Mode" (pending status), Implement the "Modify & Accept" approval flow.
      * **Tech Tasks:** Set up Celery/Redis/Channels. Build API endpoints for `approve`, `reject`, `modify`. Implement real-time WebSocket updates to the frontend.

  * **Sprint 5: Permissions & Polish**

      * **Goal:** Implement the security and privacy layer.
      * **User Stories:** Implement the "Connection Settings" screen, Enforce `is_allowed` and `auto_approve` logic.

  * **Tech Tasks:** Build `Connection_Permission` model and API endpoints.

-----

## 7\. 🧪 Testing Strategy

We will use a 4-level testing strategy to ensure reliability and quality.

### 7.1 Level 1: Unit Testing (Micro)

  * **Goal:** Test individual functions and components in isolation.
  * **Backend:** **`Pytest`**. Test individual helper functions, model methods, and permission logic.
  * **Frontend:** **`vitest`** + **`React Testing Library`**. Test individual React components (e.g., "Does the `ChatBubble` render correctly?").

### 7.2 Level 2: Integration Testing (Connections)

  * **Goal:** Test if multiple internal parts work together.
  * **Backend:** **`Pytest-Django`**. Test API endpoints by simulating requests. **This is our most critical backend testing.** We will write tests that cover the entire API-level approval flow.
  * **Frontend:** **`vitest`** + **`Mock Service Worker`**. Test if React components correctly call our (mocked) API and handle the JSON responses.

### 7.3 Level 3: System Testing (E2E)

  * **Goal:** Test the entire, live application from a real user's perspective.
  * **Tool:** **`Playwright`**.
  * **Process:** A robot will open a real browser, run the React app, and interact with the *live* Django backend.
  * **Example Flow:** `Login as User A` -\> `Connect with User B` -\> `Login as User B` -\> `Accept Connection` -\> `Login as User A` -\> `Send Pending Transaction` -\> `Login as User B` -\> `Modify & Accept Transaction` -\> `Login as User A` -\> `Verify Status changed to Confirmed`.

### 7.4 Level 4: Acceptance Testing (Manual)

  * **Goal:** Confirm the feature meets your vision.
  * **Who:** **You (the Product Owner)**.
  * **Process:** After a feature passes Levels 1-3, you will manually test it on a "Staging" server. You provide the final "go/no-go" based on functionality and "feel."

-----

## 8\. 🛠️ Development Environment & Tooling

To ensure consistency, speed, and quality, all development will use the following modern toolchain.

### 8.1 Containerization

  * **`Docker`** & **`Docker Compose`**: **This is mandatory.** The entire stack (`Django`, `Postgres`, `Redis`, `React`) will be defined in a `docker-compose.yml` file for a one-command setup and perfect dev/prod parity.

### 8.2 Version Control & CI/CD

  * **`Git`** & **`GitHub`**: All code will be managed in a GitHub repository.
  * **`GitHub Actions`**: We will implement a CI/CD pipeline. On every code push, it will automatically:
    1.  Install dependencies (using `uv` and `npm`).
    2.  Run all Linters (`ruff`).
    3.  Run all Type Checks (`mypy`).
    4.  Run all Unit & Integration Tests (`Pytest`, `vitest`).
    5.  **Code will be blocked from merging if any of these steps fail.**

### 8.3 Python (Backend) Tooling

  * **Package Manager:** **`uv`**. Replaces `pip` and `venv` for ultra-fast dependency management.
  * **Linter & Formatter:** **`ruff`**. Replaces `Black`, `Flake8`, and `isort` for all-in-one, high-speed code quality.
  * **Type Checker:** **`mypy`**. For stable, production-ready static type checking.

### 8.4 JavaScript (Frontend) Tooling

  * **Build Tool:** **`Vite`**. For a fast, modern React development experience.
  * **Unit Testing:** **`vitest`**. The native, high-speed testing framework for Vite.
  * **Code Quality:** **`ESLint`** (linting) & **`Prettier`** (formatting).

### 8.5 API Testing

  * **`Postman`** / **`Insomnia`**: Recommended for all developers to manually test and debug API endpoints during development.

-----

## 9\. 📖 Glossary

  * **Contact:** The user-facing term for an `External Payee` (e.g., "Grocery Store", "Landlord").
  * **Entity:** The core concept. Any "thing" in the app that can send, receive, or be part of a transaction (e.g., `Account`, `External Payee` (Contact), `Category`).
  * **Payment Mode:** The "tool" used for a transaction (e.g., "My GPay," "BOB Debit Card").
  * **Networked-First:** The architectural principle that the app is built from the ground up to support user-to-user connections.
  * **Chat-Centric:** The UI principle that the entire app experience is modeled after a chat application.
  * **Solo Mode:** A transaction with an `External Payee` (e.g., `Grocery Store`). No approvals needed.
  * **Networked Mode:** A transaction with a connected `User`. Requires approval.
  * **Connection Permission:** The set of rules a payee defines for a specific payer (e.g., "Papa can auto-send UPI payments to my BOB account").
  * **Opening Balance:** A term for the user-facing *action* of setting a starting balance, which is *implemented* by creating a new transaction.