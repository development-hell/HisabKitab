# Hisab Kitab - API Documentation (v1)

This is a living document detailing the REST API endpoints for the Hisab Kitab project. All routes are prefixed with `/api/`.

## 1\. Authentication

These endpoints are used for user registration and session management.

### `POST /api/token/`

  * **Action:** Obtains a new JWT access and refresh token pair.
  * **Authentication:** None.
  * **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "your_password"
    }
    ```
  * **Response Body (200 OK):**
    ```json
    {
      "access": "...",
      "refresh": "..."
    }
    ```

### `POST /api/token/refresh/`

  * **Action:** Refreshes an expired access token. This is used automatically by the frontend's API interceptor.
  * **Authentication:** None.
  * **Request Body:**
    ```json
    {
      "refresh": "your_refresh_token"
    }
    ```
  * **Response Body (200 OK):**
    ```json
    {
      "access": "new_access_token"
    }
    ```

## 2\. Users

Endpoints for managing user accounts and profiles.

### `POST /api/users/`

  * **Action:** Registers a new user (Sign up).
  * **Authentication:** `AllowAny`.
  * **Request Body:** (See `UserSerializer`)
    ```json
    {
      "email": "newuser@example.com",
      "username": "newuser",
      "password": "strong_password123",
      "first_name": "John",
      "last_name": "Doe"
    }
    ```
  * **Response Body (201 Created):** The new User object (password is write-only).

### `GET /api/users/`

  * **Action:** Lists all users. This is used by the frontend's "Connections" page to find a user's ID from their email.
  * **Authentication:** Bearer Token.
  * **Response Body (200 OK):**
    ```json
    [
      { "user_id": 1, "email": "...", "username": "..." },
      { "user_id": 2, "email": "...", "username": "..." }
    ]
    ```

### `GET /api/users/me/`

  * **Action:** A custom action to retrieve the profile for the *currently authenticated user*. Used by the `AuthContext` and `Profile.tsx`.
  * **Authentication:** Bearer Token.
  * **Response Body (200 OK):** The full User object for the logged-in user.

### `PATCH /api/users/me/`

  * **Action:** A custom action to update the profile for the *currently authenticated user*. Used by `Profile.tsx`.
  * **Authentication:** Bearer Token.
  * **Request Body:** `multipart/form-data` or `application/json` for non-file fields.
    ```json
    {
      "first_name": "NewFirstName",
      "phone_number": "1234567890",
      "profile_image": "(file_upload)"
    }
    ```
  * **Response Body (200 OK):** The updated User object.

## 3\. Connections

Endpoints for managing the "friends list" or social graph.

### `GET /api/connections/`

  * **Action:** Lists all connections where the current user is either the requester or receiver. Used by the `Dashboard.tsx` and `Connections.tsx` pages.
  * **Authentication:** Bearer Token.
  * **Response Body (200 OK):**
    ```json
    [
      {
        "connection_id": 1,
        "requester": 1,
        "receiver": 2,
        "status": "pending",
        "message": "Hey, let's connect!"
      }
    ]
    ```

### `POST /api/connections/`

  * **Action:** Creates a new connection request. The `requester` is set to the current user automatically.
  * **Authentication:** Bearer Token.
  * **Request Body:**
    ```json
    {
      "receiver": 2,
      "message": "Hey, let's connect!"
    }
    ```
  * **Response Body (201 Created):** The new connection object.

### `POST /api/connections/{id}/accept/`

  * **Action:** Custom action to accept a pending connection request.
  * **Authentication:** Bearer Token (must be the `receiver` of the request).
  * **Request Body:** Empty.
  * **Response Body (200 OK):** The connection object with `status: "accepted"`.

### `POST /api/connections/{id}/reject/`

  * **Action:** Custom action to reject a pending connection request.
  * **Authentication:** Bearer Token (must be the `receiver` of the request).
  * **Request Body:** Empty.
  * **Response Body (200 OK):** The connection object with `status: "rejected"`.

## 4\. Entities

These endpoints will power the core "Unified Entity Model". This includes Accounts, Categories, and **Contacts** (External Payees).

### `GET /api/entities/`

  * **Action:** Lists all entities for the current user.
  * **Query Params:**
      * `?type=ACCOUNT`: Returns user's bank accounts, wallets, etc.
      * `?type=EXTERNAL_PAYEE`: Returns user's **Contacts** (e.g., "Grocery Store").
      * `?type=CATEGORY`: Returns user's budget categories (e.g., "Food").

### `POST /api/entities/`

  * **Action:** Creates a new entity (e.g., a new **Contact** or Account).

-----