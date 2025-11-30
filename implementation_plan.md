# Refine Light/Dark Theme

The goal is to soften the current high-contrast theme to a modern, gray-based aesthetic for both light and dark modes.

## User Review Required
- **Color Palette Changes**: The entire app's color scheme will shift from black/white/green to gray/off-white/indigo.
- **Heatmap Colors**: Heatmaps will change from green to indigo to match the new accent color.

## Proposed Changes

### CSS Variables & Tailwind Config
#### [MODIFY] [index.css](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/index.css)
- Update `:root` and `.dark` variables to the new gray-based palette.
- Map user's requested variable names to existing names to minimize refactoring:
    - `--background`: `#f5f5f7` (light) / `#111217` (dark)
    - `--surface`: `#ffffff` (light) / `#181920` (dark)
    - `--surface-highlight`: `#f1f2f4` (light) / `#1f2129` (dark)
    - `--text-primary`: `#111827` (light) / `#e5e7eb` (dark)
    - `--text-secondary`: `#6b7280` (light) / `#9ca3af` (dark)
    - `--border`: `#e5e7eb` (light) / `#2d3038` (dark)
    - `--accent`: `#818cf8` (light) / `#a5b4fc` (dark)
    - `--accent-soft`: `#eef2ff` (light) / `#272a3b` (dark) (NEW)

#### [MODIFY] [tailwind.config.js](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/tailwind.config.js)
- Update color definitions to match the new variables.
- Add `accent-soft` to the color palette.

### Components
#### [MODIFY] [Calendar.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Calendar.jsx)
- Update heatmap intensity classes to use `bg-accent` and `bg-accent-soft` with varying opacities instead of green.

#### [MODIFY] [Dashboard.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/Dashboard.jsx)
- Update heatmap intensity classes to match `Calendar.jsx`.

#### [MODIFY] [SessionDetail.jsx](file:///Users/ivantomilo/Developer/learning/random/study-ses-analyzer/src/components/SessionDetail.jsx)
- Update status badges (green/yellow/red) to be softer or use the new palette if appropriate, but keeping semantic meaning (success/warning/error) is usually best. Will soften the colors if possible using `accent` or just softer standard colors.

## Verification Plan
### Manual Verification
- Check Light Mode:
    - Background is soft gray (`#f5f5f7`).
    - Cards are white.
    - Text is dark gray.
- Check Dark Mode:
    - Background is dark gray (`#111217`).
    - Cards are slightly lighter gray (`#181920`).
    - Text is off-white.
- Toggle between modes to ensure smooth transition.
- Check Calendar and Dashboard heatmaps for visibility and aesthetics.
