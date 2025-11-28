# Focus Session Analyzer

A modern, minimalist web application to help you track your focus sessions, manage distractions, and analyze your productivity patterns. Built with React, Tailwind CSS, and a focus on clean design.

![App Screenshot](https://via.placeholder.com/800x400?text=Focus+Session+Analyzer+Preview)

## Features

- **🎯 Flexible Sessions**: Choose from various session types (Work, Study, Creative, Planning, Chores) and set specific goals.
- **⏱️ Focus Timer**: Distraction-free timer to track your deep work sessions.
- **⚡ Micro-Events**: Log "Flow" states, "Milestones", and take structured "Breaks" without stopping the timer.
- **📝 Distraction Logging**: Quickly log interruptions with one click (Phone, Social Media, Hunger) or add custom reasons.
- **⭐ Session Review**: Rate your focus (1-5 stars), mark goal completion status, and add tags after each session.
- **📊 Detailed Timeline**: View a chronological timeline of every event (distractions, flow, breaks) in your session history.
- **📅 History & Filtering**: Browse past sessions and filter by type or tags.
- **📈 Statistics**: Visualize your progress with 7-day and 30-day analytics (Total Focus Time, Distractions/Hour).
- **💾 Local Storage**: All data is persisted locally on your device. No account required.

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
