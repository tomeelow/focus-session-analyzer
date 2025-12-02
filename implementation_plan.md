# Implementation Plan - Branding Update

## Goal Description
Update Mindtrack's visual identity with a new minimalist "brain" logo and a unified deep blue accent color (`#1d4ed8`).

## User Review Required
> [!NOTE]
> The accent color will be changed to a deep blue. This will affect buttons, links, and other interactive elements.

## Proposed Changes

### Design System
#### [MODIFY] [index.css](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/index.css)
- Update `--color-accent` and `--color-accent-soft` variables.
- Light Mode: `#1d4ed8` (Accent), `#e0ecff` (Soft)
- Dark Mode: `#60a5fa` (Accent), `#1e293b` (Soft)

### Components
#### [NEW] [BrainIcon.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/BrainIcon.jsx)
- Create a minimalist SVG brain icon.
- Props: `className`.

#### [NEW] [MindtrackLogo.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/MindtrackLogo.jsx)
- Combine `BrainIcon` and "Mindtrack" text.
- Props: `variant` (full/compact), `className`.

### Integration
#### [MODIFY] [App.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/App.jsx)
- Replace the text-based header logo with `MindtrackLogo`.

#### [MODIFY] [AuthScreen.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/AuthScreen.jsx)
- Replace the "M" placeholder with `MindtrackLogo`.
- Add the tagline "Track your focus. Understand your patterns."

## Verification Plan
### Manual Verification
- Open the app in Light Mode and Dark Mode.
- Verify the new accent color on buttons and links.
- Verify the Logo in the Header.
- Verify the Logo and Tagline on the Auth Screen (Logout to see it).
