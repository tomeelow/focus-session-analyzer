import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { AnalyticsService } from './utils/analytics';
import { AchievementService } from './utils/achievements';
import { ActiveSession } from './components/ActiveSession';
import { SessionSetup } from './components/SessionSetup';
import { AuthScreen } from './components/AuthScreen';
import { MindtrackLogo } from './components/MindtrackLogo';

import { SessionSummary } from './components/SessionSummary';
import { History } from './components/History';
import { SessionDetail } from './components/SessionDetail';
import { Stats } from './components/Stats';
import { Dashboard } from './components/Dashboard';
import { AchievementsList } from './components/AchievementsList';
import { Profile } from './components/Profile';
import { Calendar } from './components/Calendar';
import { ProfileService } from './services/profile';
import { Button } from './components/Button';
import { useTheme } from './context/ThemeContext';
import { Play, LayoutDashboard, History as HistoryIcon, Trophy, Download, User, Calendar as CalendarIcon, Sun, Moon, LogOut } from 'lucide-react';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('home'); // home, setup, running, end, summary, detail, dashboard, achievements
  const [sessions, setSessions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [currentSessionConfig, setCurrentSessionConfig] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userId = StorageService.getCurrentUserId();
    if (userId) {
      const users = StorageService.getUsers();
      if (users.some(u => u.id === userId)) {
        setIsAuthenticated(true);
        loadUserData();
      } else {
        // User ID exists but user not found (maybe deleted?)
        StorageService.logout();
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  const loadUserData = () => {
    const loadedSessions = StorageService.getSessions();
    setSessions(loadedSessions);

    // Load user profile
    const profile = ProfileService.getProfile();
    setUserProfile(profile);

    // Initial achievement check
    const streaks = AnalyticsService.calculateStreaks(loadedSessions);
    setAchievements(AchievementService.evaluate(loadedSessions, streaks));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadUserData();
    setView('home');
  };

  const handleLogout = () => {
    StorageService.logout();
    setIsAuthenticated(false);
    setSessions([]);
    setUserProfile(null);
    setAchievements([]);
    setView('home');
  };

  const handleStartSetup = () => {
    setView('setup');
  };

  const handleStartSession = (config) => {
    setCurrentSessionConfig(config);
    setView('running');
  };

  const handleEndSession = (finalSession) => {
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

  const handleDiscardSession = () => {
    setView('home');
    setCurrentSessionConfig(null);
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
    <nav className="flex items-center justify-center gap-1 p-1 bg-surface border border-border rounded-full mb-8 mx-auto w-fit backdrop-blur-sm">
      <button
        onClick={() => setView('home')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'home' || view === 'setup' ? 'bg-background text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
      >
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Timer</span>
        </div>
      </button>
      <button
        onClick={() => setView('dashboard')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'dashboard' ? 'bg-background text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
      >
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </div>
      </button>
      <button
        onClick={() => setView('calendar')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'calendar' ? 'bg-background text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Calendar</span>
        </div>
      </button>
      <button
        onClick={() => setView('history')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'history' || view === 'detail' ? 'bg-background text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
      >
        <div className="flex items-center gap-2">
          <HistoryIcon className="w-4 h-4" />
          <span className="hidden sm:inline">History</span>
        </div>
      </button>
      <button
        onClick={() => setView('achievements')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'achievements' ? 'bg-background text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
          }`}
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">Trophies</span>
        </div>
      </button>
    </nav>
  );

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-accent selection:text-accent-foreground transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <header className="flex items-center justify-between pb-6 border-b border-border">
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setView('home')}
          >
            <MindtrackLogo />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-text-secondary hover:text-text-primary">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport} className="text-text-secondary hover:text-text-primary">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <button
              onClick={() => setView('profile')}
              className="w-8 h-8 rounded-full overflow-hidden bg-surface border border-border flex items-center justify-center hover:ring-2 hover:ring-accent transition-all"
              title="User Profile"
            >
              {userProfile?.avatarDataUrl ? (
                <img src={userProfile.avatarDataUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-text-secondary" />
              )}
            </button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-text-secondary hover:text-red-500" title="Log Out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {view !== 'running' && view !== 'end' && view !== 'summary' && <Nav />}

        <main>
          {view === 'home' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="text-center space-y-6 py-8">
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                  Mindtrack
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
            <Dashboard sessions={sessions} achievements={achievements} userProfile={userProfile} />
          )}

          {view === 'calendar' && (
            <Calendar sessions={sessions} dayStartHour={userProfile?.dayStartHour || 0} />
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
            <ActiveSession
              initialConfig={currentSessionConfig}
              onEndSession={handleEndSession}
              onDiscard={handleDiscardSession}
            />
          )}

          {view === 'summary' && completedSession && (
            <SessionSummary session={completedSession} onClose={handleCloseSummary} />
          )}

          {view === 'detail' && selectedSession && (
            <SessionDetail session={selectedSession} onClose={() => setView('history')} />
          )}

          {view === 'profile' && (
            <Profile onProfileUpdate={handleProfileUpdate} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
