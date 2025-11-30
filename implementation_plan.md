# Session Review Modal Implementation Plan

## Goal Description
Implement an end-of-session Review Modal that allows users to review and enrich session data (type, goal, rating, tags, notes) before saving. This replaces the current `SessionEnd` view and adds "Discard" and "Cancel" functionality.

## User Review Required
> [!NOTE]
> The `SessionEnd` component will be removed and replaced by a modal within `ActiveSession`.

## Proposed Changes

### Components
#### [NEW] [SessionReviewModal.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/SessionReviewModal.jsx)
- **Props**: `session` (current data), `onSave`, `onDiscard`, `onCancel`.
- **State**: `sessionType`, `activityLabel`, `goal`, `goalStatus`, `focusRating`, `tags`, `note`.
- **UI**:
    - Header: Duration, Start/End time.
    - Fields:
        - Session Type (Dropdown).
        - Activity Label (Input).
        - Goal (Input + Status Radios).
        - Focus Rating (Stars/Number).
        - Tags (Input).
        - Note (Textarea).
    - Footer: "Save Session" (Primary), "Discard Session" (Secondary/Danger), "Back" (Ghost).

#### [MODIFY] [ActiveSession.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/ActiveSession.jsx)
- **State**: Add `isReviewing` (boolean).
- **Logic**:
    - `handleEnd`: Pause timer (stop interval), set `isReviewing(true)`.
    - Render `SessionReviewModal` when `isReviewing` is true.
    - `handleSave`: Call `onEndSession` with final data.
    - `handleDiscard`: Call `onDiscard`.
    - `handleCancel`: Set `isReviewing(false)`, resume timer.

#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Remove `SessionEnd` usage.
- Update `handleEndSession` to perform saving (merge with `handleSaveSession`).
- Add `handleDiscardSession` (navigate to home).
- Pass `onDiscard` to `ActiveSession`.

#### [DELETE] [SessionEnd.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/SessionEnd.jsx)
- Component is obsolete.

### Data Display
#### [MODIFY] [History.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/History.jsx)
- Display `focusRating` (stars).
- Display `note` indicator (icon).
- Display `tags` (pills).

#### [MODIFY] [SessionDetail.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/SessionDetail.jsx)
- Display `goal` + `goalStatus`.
- Display `focusRating`.
- Display `tags`.
- Display `note`.

## Verification Plan

### Manual Verification
1.  **End Session Flow**:
    -   Start session -> Click "End Session".
    -   Verify Modal appears.
    -   Verify Timer is paused (background).
2.  **Edit & Save**:
    -   Change type, add note, set rating.
    -   Click "Save".
    -   Verify redirected to Summary/Home.
    -   Verify data is saved in History.
3.  **Discard**:
    -   Start session -> End -> Discard.
    -   Verify session is NOT in History.
4.  **Cancel**:
    -   Start session -> End -> Cancel.
    -   Verify Modal closes, Timer resumes.
