# Implementation Plan - LocalStorage Authentication

## Goal Description
Add a basic email/password authentication layer to Mindtrack using `localStorage`. This will support multiple users on the same device, with isolated data for each user.

## User Review Required
> [!IMPORTANT]
> This is a **demo implementation** of authentication. Passwords will be stored with a simple hash (SHA-256) in `localStorage`. This is **not secure** for production use but sufficient for this demo.

## Proposed Changes

### Data Model & Storage
#### [MODIFY] [storage.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/services/storage.js)
- Add `StoredUser` interface (conceptually).
- Add methods:
    - `getUsers()`: Returns list of registered users.
    - `saveUser(user)`: Adds a new user.
    - `getCurrentUserId()`: Returns the ID of the logged-in user.
    - `setCurrentUserId(id)`: Sets the logged-in user.
    - `logout()`: Clears the current user ID.
- Update `getSessions`, `saveSession`, `getTemplates`, `saveTemplate`, `getProfile`, `saveProfile` to use `mindtrack.<userId>.*` keys.
- Add migration logic: If `mindtrack.sessions` exists (old format) and we are signing up the first user, move data to `mindtrack.<userId>.sessions`.

### Authentication UI
#### [NEW] [AuthScreen.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/AuthScreen.jsx)
- Create a new component for the authentication flow.
- State: `mode` ('login' | 'signup').
- Render Login form or Signup form.
- Handle form submission:
    - **Signup**: Validate email/password, create user, save to `localStorage`, log in.
    - **Login**: Find user by email, hash password, compare, log in.
- Use `crypto.subtle.digest` for password hashing.

### App Integration
#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Add state `isAuthenticated` (derived from `StorageService.getCurrentUserId()`).
- On mount, check if user is logged in.
    - If yes, load data.
    - If no, show `AuthScreen`.
- Handle `onLogin` callback from `AuthScreen` to trigger data loading and view switch.
- Handle `onLogout` callback (pass to `Profile` or Header).

#### [MODIFY] [Profile.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Profile.jsx)
- Add "Log Out" button.

## Verification Plan

### Manual Verification
1.  **Initial Load**: Open app, verify `AuthScreen` is shown.
2.  **Sign Up**:
    - Enter valid email/password.
    - Verify redirection to main app.
    - Check `localStorage` for `mindtrack.users` and `mindtrack.currentUserId`.
3.  **Data Isolation**:
    - Create some sessions.
    - Log out.
    - Sign up as User B.
    - Verify empty session list.
    - Create sessions for User B.
    - Log out and log back in as User A.
    - Verify User A's sessions are restored.
4.  **Migration**:
    - (Optional) Manually set old `localStorage` keys and verify they are migrated on first signup.
