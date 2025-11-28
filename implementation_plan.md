# Implementation Plan - Analytics & Dashboard Upgrade

## Goal Description
Upgrade "Focus Session Analyzer" with a new Dashboard, Analytics, Streak tracking, Session Templates, and Achievements system to enhance user engagement and provide deeper insights.

## User Review Required
> [!NOTE]
> No breaking changes expected. Data migration for achievements will be calculated on the fly or on first load.

## Proposed Changes

### Data Layer
#### [MODIFY] [storage.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/services/storage.js)
- Add methods for Templates: `getTemplates`, `saveTemplate`, `deleteTemplate`.
- Templates schema: `{ id, name, sessionType, activityLabel, goal }`.

### Utilities
#### [NEW] [analytics.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/utils/analytics.js)
- `calculateDailyStats(sessions)`: Returns today's focus time, count, distractions.
- `calculateWeeklyStats(sessions)`: Returns last 7 days stats.
- `calculateStreaks(sessions)`: Returns current and longest streaks.
- `calculateDistractionInsights(sessions)`: Aggregates distraction reasons.
- `getHeatmapData(sessions)`: Returns daily intensity for the last 30 days.

#### [NEW] [achievements.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/utils/achievements.js)
- `evaluateAchievements(sessions)`: Returns list of achievements with status (locked/unlocked).
- Definitions for: `firstSession`, `threeSessionsOneDay`, `hundredMinutesTotal`, `noDistractionLongSession`, `weekStreak7`.

### Components

#### [NEW] [Dashboard.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Dashboard.jsx)
- Main view component.
- Displays "Today" and "This Week" cards.
- Displays "Streaks" and Heatmap.
- Displays "Distraction Insights".
- Displays "Achievements" summary.

#### [NEW] [TemplateList.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/TemplateList.jsx)
- UI for listing, creating, and deleting templates.

#### [MODIFY] [SessionSetup.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/SessionSetup.jsx)
- Add "Choose Template" dropdown/button.
- Logic to prefill form when template is selected.

#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Add navigation (Tabs or Sidebar) to switch between Home (Timer), Dashboard, History, Templates.
- Integrate `Dashboard` and `TemplateList` views.
- Add "Export Data" button in footer or settings area.

## Verification Plan
### Automated Tests
- N/A (Project currently has no test runner).

### Manual Verification
- **Dashboard**: Verify stats match recorded sessions. Check visualizations.
- **Templates**: Create a template, use it to start a session, verify fields are prefilled.
- **Streaks**: Manually manipulate local storage (or create sessions) to verify streak calculation.
- **Achievements**: Verify achievements unlock when conditions are met.
- **Export**: Download JSON and verify content.
