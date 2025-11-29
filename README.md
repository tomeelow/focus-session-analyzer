# Focus Session Analyzer

A modern, minimalist web application to help you track your focus sessions, manage distractions, and analyze your productivity patterns. Built with React, Tailwind CSS, and a focus on clean design.

![App Screenshot](https://via.placeholder.com/800x400?text=Focus+Session+Analyzer+Preview)

## Features

### Core Focus
- **🎯 Flexible Sessions**: Choose from various session types (Work, Study, Creative, Planning, Chores) and set specific goals.
- **⏱️ Focus Timer**: Distraction-free timer to track your deep work sessions.
- **⚡ Micro-Events**: Log "Flow" states, "Milestones", and take structured "Breaks" without stopping the timer.
- **📝 Distraction Logging**: Quickly log interruptions with one click (Phone, Social Media, Hunger) or add custom reasons.
- **⭐ Session Review**: Rate your focus (1-5 stars), mark goal completion status, and add tags after each session.

### Analytics & Insights
- **📊 Dashboard**: Get a high-level overview of your productivity with daily/weekly stats and activity heatmaps.
- **🔥 Streaks**: Track your daily consistency with current and longest streak counters.
- **🚫 Distraction Insights**: Identify your top distractions with detailed breakdowns and percentage analysis.
- **🏆 Achievements**: Unlock trophies for hitting milestones like "First Session", "Hat Trick" (3 sessions/day), and "Century Club" (100 mins total).

### Productivity Tools
- **� Templates**: Create and save reusable session templates (e.g., "Morning Deep Work", "Quick Study") to start faster.
- **📅 History & Filtering**: Browse past sessions and filter by type or tags.
- **💾 Local Storage**: All data is persisted locally on your device. No account required.
- **📤 Export Data**: Download your complete history, templates, and achievements as a JSON file for backup.

### Personalization
- **👤 User Profile**: Customize your experience with a display name, bio, and preferred session type.
- **🖼️ Avatar**: Upload a personal avatar that persists locally and appears in the app header.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utils**: [date-fns](https://date-fns.org/)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tomeelow/focus-session-analyzer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd focus-session-analyzer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## License

MIT
