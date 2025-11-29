# Mindtrack Rename & Calendar Feature Implementation Plan

## Goal Description
Rename the application from "Focus Session Analyzer" to "Mindtrack" and introduce a new "Calendar Overview" page. This page will provide a monthly view of focus time, respecting the user's "Day Starts At" preference.

## User Review Required
> [!NOTE]
> The app name change will be reflected in the browser title, header, and welcome message.

## Proposed Changes

### Renaming
#### [MODIFY] [index.html](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/index.html)
- Change `<title>` to "Mindtrack".

#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Update Header title to "Mindtrack".
- Update Welcome message to "Mindtrack".
- Update "F" logo to "M" (optional but nice).

### Calendar Feature
#### [NEW] [Calendar.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Calendar.jsx)
- **State**: `currentDate` (Date object, defaults to now), `selectedDay` (Date object or null).
- **Props**: `sessions`, `dayStartHour`.
- **Logic**:
    - `daysInMonth`: Calculate days for the current month view.
    - `getUserDayId(date, dayStartHour)`: Reuse or import from `AnalyticsService` (might need to export it if not already).
    - Group sessions by `userDayId`.
    - Calculate total duration per day.
    - Determine intensity level (0, 0-30, 31-90, >90).
- **UI**:
    - Header: Month/Year label, Prev/Next buttons.
    - Grid: 7 columns (Mon-Sun).
    - Cells: Day number, intensity background.
    - Legend: Explain intensity colors.
    - Detail View (Modal/Panel): Show sessions for selected day.

#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Import `Calendar` component.
- Add `calendar` to `view` state options.
- Add "Calendar" button to `Nav` component.
- Render `Calendar` component when `view === 'calendar'`.

#### [MODIFY] [AnalyticsService](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/utils/analytics.js)
- Ensure `getUserDayStart` is exported and usable by Calendar (it is).

## Verification Plan

### Manual Verification
1.  **Renaming**:
    -   Check browser tab title.
    -   Check Header title.
    -   Check Welcome message.
2.  **Calendar Navigation**:
    -   Click "Calendar" in nav. Verify Calendar page loads.
3.  **Calendar Logic**:
    -   Check current month is displayed.
    -   Navigate to previous/next months.
    -   Verify "today" has correct focus time (compare with Dashboard).
    -   Verify intensity colors match duration.
4.  **Day Start Hour**:
    -   Change "Day Starts At" in Profile.
    -   Verify Calendar updates (sessions before start hour move to previous day).
5.  **Detail View**:
    -   Click a day. Verify session list is correct.
