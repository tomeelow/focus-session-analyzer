# Focus Session Analyzer

A modern, minimalist web application to help you track your focus sessions, manage distractions, and analyze your productivity patterns. Built with React, Tailwind CSS, and a focus on clean design.

![App Screenshot](https://via.placeholder.com/800x400?text=Focus+Session+Analyzer+Preview)

## Features

### Core Focus
- **🎯 Flexible Sessions**: Choose from various session types (Work, Study, Creative, Planning, Chores) and set specific goals.
- **⏱️ Focus Timer**: Distraction-free timer to track your deep work sessions.
- **⏱️ Focus Timer**: Distraction-free timer with customizable duration.
- **🏷️ Session Tagging**: Categorize sessions by type (Study, Work, Creative, etc.) and add specific goals.
- **� Distraction Logging**: Quickly log internal and external interruptions to understand what breaks your flow.
- **📝 Post-Session Reflection**: Rate your focus and add notes after each session.

### Analytics & Insights
- **📊 Dashboard**: Visualize your daily and weekly progress with charts and key metrics.
- **🔥 Streak Tracking**: Build consistency by tracking consecutive days of focus.
- **📅 Calendar Overview**: View your focus history in a monthly calendar with intensity heatmaps.
- **� Distraction Analysis**: Identify top distraction sources to improve your environment.
- **�️ Activity Heatmap**: See your most productive times of day.

### Productivity Tools
- ** Templates**: Create and save reusable session templates (e.g., "Morning Deep Work", "Quick Study") to start faster.
- **📅 History & Filtering**: Browse past sessions and filter by type or tags.
- **💾 Local Storage**: All data is persisted locally on your device. No account required.
- **📤 Export Data**: Download your complete history, templates, and achievements as a JSON file for backup.

### Personalization
- **👤 User Profile**: Customize your experience with a display name, bio, and preferred session type.
- **🖼️ Avatar**: Upload a personal avatar that persists locally and appears in the app header.
- **⚙️ Focus Preferences**: Set default session duration and custom day start hour (e.g., 4 AM) to tailor analytics to your schedule.
- **🌙 Light/Dark Mode**: Switch between a soft light theme and a modern dark theme to suit your environment.
- **🔐 Authentication**: Secure your data with email/password login. Supports multiple users on the same device with isolated data storage.

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
