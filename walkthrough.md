# Authentication Walkthrough

I have implemented a local email/password authentication system for Mindtrack. This allows multiple users to use the app on the same device with isolated data.

## Changes

### Authentication UI
- **New Auth Screen**: A dedicated screen for Login and Sign Up.
- **Form Validation**: Checks for valid email format, password length, and matching passwords on signup.
- **Password Hashing**: Uses SHA-256 to hash passwords before storing them in `localStorage`.

### Data Storage
- **Multi-User Support**: `StorageService` now manages a list of users and tracks the current logged-in user.
- **Data Isolation**: All data (sessions, templates, profile) is now stored under user-specific keys (e.g., `mindtrack.<userId>.sessions`).
- **Migration**: Existing data is automatically migrated to the first user who signs up.

### Integration
- **App Flow**: The app now checks for a logged-in user on startup. If none is found, it shows the Auth Screen.
- **Logout**: Added a Logout button to the header.

## Verification Results

I verified the following flows using the browser automation tool:

1.  **Sign Up**: Successfully created a new account (`test@example.com`).
2.  **Session Creation**: Created and saved a focus session for the new user.
3.  **Logout**: Successfully logged out and returned to the Auth Screen.
4.  **Data Isolation**:
    - Signed up a second user (`test2@example.com`).
    - Verified that their history was empty (did not see User 1's session).
5.  **Data Persistence**:
    - Logged out User 2.
    - Logged back in as User 1.
    - Verified that the original session was restored.

### Screenshots

**Initial Auth Screen**
![Auth Screen](/Users/ivantomilo/.gemini/antigravity/brain/2b8fa95f-92c9-4c07-8483-01f2d16943de/initial_auth_screen_1764696646527.png)

**User 1 History (Before Logout)**
![User 1 History](/Users/ivantomilo/.gemini/antigravity/brain/2b8fa95f-92c9-4c07-8483-01f2d16943de/user1_history_1764696768552.png)

**User 2 History (Empty)**
![User 2 History](/Users/ivantomilo/.gemini/antigravity/brain/2b8fa95f-92c9-4c07-8483-01f2d16943de/user2_history_1764696815672.png)

**User 1 History (Restored after Login)**
![User 1 History Restored](/Users/ivantomilo/.gemini/antigravity/brain/2b8fa95f-92c9-4c07-8483-01f2d16943de/user1_history_restored_1764696867972.png)
