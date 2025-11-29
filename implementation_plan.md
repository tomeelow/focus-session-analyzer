# Profile Settings Integration Plan

## Goal Description
Extend the User Profile to include "Focus preferences" (default session duration, day start hour) and integrate these settings into the Session Setup and Analytics features.

## User Review Required
> [!NOTE]
> Analytics calculations will change to respect the "Day starts at" setting. This means "Today" might cover a different time range than the calendar day.

## Proposed Changes

### Services
#### [MODIFY] [profile.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/services/profile.js)
- Ensure `getProfile` returns defaults for new fields if they don't exist.
- Defaults: `defaultSessionDurationMinutes: null`, `dayStartHour: 0`.

### Utils
#### [MODIFY] [analytics.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/utils/analytics.js)
- Add `getUserDayStart(date, dayStartHour)` helper.
- Update `calculateDailyStats`, `calculateWeeklyStats`, `calculateStreaks`, `getHeatmapData` to accept `dayStartHour` as an argument.
- Replace hardcoded `setHours(0,0,0,0)` logic with `getUserDayStart`.

### Components
#### [MODIFY] [Profile.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Profile.jsx)
- Add "Focus Preferences" section.
- Add Select/Input for `defaultSessionDurationMinutes`.
- Add Select for `dayStartHour` (0-23).
- Save these new fields to `ProfileService`.

#### [MODIFY] [SessionSetup.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/SessionSetup.jsx)
- Fetch profile on mount.
- If `preferredSessionType` exists, set it as default `sessionType`.
- If `defaultSessionDurationMinutes` exists, display a hint (e.g., "Default target: X min").

#### [MODIFY] [Dashboard.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Dashboard.jsx)
- Accept `userProfile` prop.
- Pass `userProfile.dayStartHour` to `AnalyticsService` methods.

#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Pass `userProfile` to `Dashboard` component.
- Update Header Title to be a button/link that sets view to 'home'.

## Verification Plan

### Manual Verification
1.  **Profile**:
    -   Go to Profile.
    -   Set "Day starts at" to 4 (04:00).
    -   Set "Default session duration" to 50.
    -   Set "Preferred session type" to "Work".
    -   Save.
2.  **Session Setup**:
    -   Go to Home -> Start Session.
    -   Verify "Work" is selected by default.
    -   Verify "Default target: 50 min" hint is visible.
3.  **Analytics**:
    -   Create a session that ends at 02:00 AM.
    -   With "Day starts at 04:00", this session should count towards the *previous* calendar day.
    -   Check Dashboard "Today" stats.
4.  **Navigation**:
    -   Click App Title in header. Verify it goes to Home.
