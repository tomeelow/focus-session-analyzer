# Study Session Analyzer

A modern, minimalist web application to help you track your study sessions and understand your distraction patterns. Built with React, Tailwind CSS, and a focus on clean design.

![App Screenshot](https://via.placeholder.com/800x400?text=Study+Session+Analyzer+Preview)

## Features

- **⏱️ Focus Timer**: Distraction-free timer to track your deep work sessions.
- **📝 Distraction Logging**: Quickly log interruptions with one click (Phone, Social Media, Hunger) or add custom reasons.
- **📊 Session Summary**: Get immediate feedback after each session with focus quality estimates.
- **📅 History**: Browse your past study sessions and see detailed breakdowns.
- **📈 Statistics**: Visualize your progress with 7-day and 30-day analytics (Total Study Time, Distractions/Hour).
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
   git clone https://github.com/yourusername/study-ses-analyzer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd study-ses-analyzer
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
