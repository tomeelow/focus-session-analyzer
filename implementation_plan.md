# User Profile Feature Implementation Plan

## Goal Description
Add a User Profile page to the Focus Session Analyzer app. This page will allow users to set a display name, bio, preferred session type, and upload an avatar. The data will be persisted in `localStorage`. Additionally, the avatar will be displayed in the main header.

## User Review Required
> [!NOTE]
> No authentication is being implemented. All data is local to the browser.

## Proposed Changes

### Services
#### [NEW] [ProfileService.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/services/profile.js)
- Create a service to handle profile data persistence in `localStorage`.
- Methods: `getProfile()`, `saveProfile(profileData)`, `clearAvatar()`.
- Data structure: `{ displayName, bio, preferredSessionType, avatarDataUrl }`.

### Components
#### [NEW] [Profile.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Profile.jsx)
- Create the Profile page component.
- State: `displayName`, `bio`, `preferredSessionType`, `avatarDataUrl`.
- UI:
    - Avatar preview (circle).
    - File input for avatar upload.
    - "Remove avatar" button.
    - Text input for Display Name.
    - Textarea for Bio.
    - Select for Preferred Session Type.
    - "Save profile" button.
- Behavior:
    - Load data on mount using `ProfileService`.
    - Handle file selection and preview (FileReader).
    - Handle save (persist to `ProfileService`).

#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Add `profile` to `view` state.
- Import `Profile` component.
- Add `Profile` component to the conditional rendering logic.
- Update `Nav` component to include a "Profile" link (or just rely on header avatar).
- Update Header to display the user avatar (tiny circle).
- Add click handler on Header avatar to navigate to `profile` view.

### Styling
- Use existing Tailwind CSS classes for consistent styling.

## Verification Plan

### Manual Verification
1.  **Navigation**: Click the "Profile" link/avatar in the header. Verify it navigates to the Profile page.
2.  **Profile Page**:
    - Verify initial state (empty or loaded from localStorage).
    - Enter name, bio, select session type.
    - Upload an image. Verify preview updates immediately.
    - Click "Save". Verify success message.
    - Reload page. Verify data persists.
    - Click "Remove avatar". Verify avatar reverts to placeholder.
3.  **Header**:
    - Verify avatar appears in the header after saving.
    - Verify clicking header avatar goes to Profile page.
