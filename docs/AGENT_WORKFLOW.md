# Agent Workflow & Guidelines

This document outlines the strict workflow and rules for the AI agent working on the Hisab Kitab project.

## Core Workflow Steps

1.  **Identify Task:**
    *   Consult `docs/specs/Hisab Kitab - SRS v1.md` and `docs/TODO.md`.
    *   Select the next logical task.

2.  **Discuss & Plan:**
    *   Present the selected task to the user.
    *   Explain the technical approach.
    *   **SRS Deviation Check:** If the user suggests changes that differ from the SRS:
        *   Highlight the difference.
        *   Explain the impact of both options (SRS vs. User Request).
        *   Recommend the better approach.
        *   **Update SRS:** If the decision changes the requirements, update `docs/specs/Hisab Kitab - SRS v1.md` immediately.

3.  **Execute:**
    *   Write the code to implement the feature.

4.  **Automated Testing:**
    *   Create automated tests (Unit/Integration) for the new feature.
    *   Run the tests and ensure they pass.

5.  **Verify (Automated):**
    *   Confirm all tests passed.

6.  **Manual Verification:**
    *   **STOP and WAIT** for the user to manually check the feature in the browser/app.
    *   Do not proceed until the user gives the "OK".

7.  **Update Documentation:**
    *   Update `docs/TODO.md` (move item to Completed).

8.  **Commit:**
    *   Stage changes (`git add .`).
    *   Commit with a conventional commit message (e.g., `feat(scope): description`).

## Additional Rules

*   **Documentation First:** Always refer to this file if unsure about the process.
*   **SRS is Living:** Keep the SRS updated with the latest decisions.
