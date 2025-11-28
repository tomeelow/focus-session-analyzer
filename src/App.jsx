import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { AnalyticsService } from './utils/analytics';
import { AchievementService } from './utils/achievements';
import { ActiveSession } from './components/ActiveSession';
import { SessionSetup } from './components/SessionSetup';
import { SessionEnd } from './components/SessionEnd';
import { SessionSummary } from './components/SessionSummary';
import { History } from './components/History';
import { SessionDetail } from './components/SessionDetail';
import { Stats } from './components/Stats';
import { Dashboard } from './components/Dashboard';
import { AchievementsList } from './components/AchievementsList';
import { Button } from './components/Button';
import { Play, LayoutDashboard, History as HistoryIcon, Trophy, Download } from 'lucide-react';

function App() {
  const [view, setView] = useState('home'); // home, setup, running, end, summary, detail, dashboard, achievements
  const [sessions, setSessions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [currentSessionConfig, setCurrentSessionConfig] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const loadedSessions = StorageService.getSessions();
    setSessions(loadedSessions);

    // Initial achievement check
    const streaks = AnalyticsService.calculateStreaks(loadedSessions);
    setAchievements(AchievementService.evaluate(loadedSessions, streaks));
  }, []);

  const handleStartSetup = () => {
    setView('setup');
  };

  const handleStartSession = (config) => {
    setCurrentSessionConfig(config);
    setView('running');
  };

  const handleEndSession = (sessionData) => {
    setCompletedSession(sessionData);
    setView('end');
  };

  const handleSaveSession = (finalSession) => {
    StorageService.saveSession(finalSession);
    const updatedSessions = StorageService.getSessions();
    setSessions(updatedSessions);

    // Check achievements
    const streaks = AnalyticsService.calculateStreaks(updatedSessions);
    const updatedAchievements = AchievementService.evaluate(updatedSessions, streaks);
    setAchievements(updatedAchievements);

    setCompletedSession(finalSession);
    setView('summary');
  };

  const handleCloseSummary = () => {
    setView('home');
    setCompletedSession(null);
    setSelectedSession(null);
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setView('detail');
  };

  const handleExport = () => {
    const data = {
      sessions: StorageService.getSessions(),
      templates: StorageService.getTemplates(),
      achievements: JSON.parse(localStorage.getItem('focus_achievements') || '{}'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-analyzer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Navigation Component
  const Nav = () => (
    <nav className="flex items-center justify-center gap-1 p-1 bg-gray-100/50 rounded-full mb-8 mx-auto w-fit backdrop-blur-sm">
      <button
        onClick={() => setView('home')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'home' || view === 'setup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Timer</span>
        </div>
      </button>
      <button
        onClick={() => setView('dashboard')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </div>
      </button>
      <button
        onClick={() => setView('history')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'history' || view === 'detail' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-4 h-4" />
          <span className="hidden sm:inline">History</span>
        </div>
      </button>
      <button
        onClick={() => setView('achievements')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'achievements' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">Trophies</span>
        </div>
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <header className="flex items-center justify-between pb-6 border-b border-gray-100">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-lg">F</span>
            Focus Session Analyzer
          </h1>
          <Button variant="ghost" size="sm" onClick={handleExport} className="text-gray-500 hover:text-gray-900">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </header>

        {view !== 'running' && view !== 'end' && view !== 'summary' && <Nav />}

        <main>
          {view === 'home' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="text-center space-y-6 py-8">
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                  Focus on what matters.
                </h2>
                <p className="text-lg text-gray-500 max-w-lg mx-auto">
                  Track your focus sessions, log distractions, and analyze your productivity patterns.
                </p>
                <Button size="lg" className="h-12 px-8 text-base rounded-full" onClick={handleStartSetup}>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Start Focus Session
                </Button>
              </div>

              <div className="space-y-8">
                <Stats sessions={sessions} />
              </div>
            </div>
          )}

          {view === 'dashboard' && (
            <Dashboard sessions={sessions} achievements={achievements} />
          )}

          {view === 'history' && (
            <History sessions={sessions} onSelectSession={handleSelectSession} />
          )}

          {view === 'achievements' && (
            <AchievementsList achievements={achievements} />
          )}

          {view === 'setup' && (
            <SessionSetup onStart={handleStartSession} />
          )}

          {view === 'running' && currentSessionConfig && (
            <ActiveSession initialConfig={currentSessionConfig} onEndSession={handleEndSession} />
          )}

          {view === 'end' && completedSession && (
            <SessionEnd session={completedSession} onComplete={handleSaveSession} />
          )}

          {view === 'summary' && completedSession && (
            <SessionSummary session={completedSession} onClose={handleCloseSummary} />
          )}

          {view === 'detail' && selectedSession && (
            <SessionDetail session={selectedSession} onClose={() => setView('history')} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
