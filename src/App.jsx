import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { useTheme } from './context/ThemeContext';
import { AnalyticsService } from './utils/analytics';
import { AchievementService } from './utils/achievements';
import { ActiveSession } from './components/ActiveSession';
import { SessionSetup } from './components/SessionSetup';
import { VerifyEmailScreen } from './components/VerifyEmailScreen';
import { AuthScreen } from './components/AuthScreen';
import { MindtrackLogo } from './components/MindtrackLogo';
import { Button } from './components/Button';
// import { Nav } from './components/Nav';
import { Stats } from './components/Stats';
import { Dashboard } from './components/Dashboard';
import { Calendar } from './components/Calendar';
import { History } from './components/History';
import { AchievementsList } from './components/AchievementsList';
import { SessionSummary } from './components/SessionSummary';
import { SessionDetail } from './components/SessionDetail';
import { Profile } from './components/Profile';
import { Moon, Sun, Download, User, LogOut, Play } from 'lucide-react';

// ... (inside App component)

function App() {
  const { theme, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [view, setView] = useState('home'); // home, setup, running, end, summary, detail, dashboard, achievements
  const [sessions, setSessions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [currentSessionConfig, setCurrentSessionConfig] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userId = StorageService.getCurrentUserId();
    const pendingUserId = StorageService.getPendingVerificationUserId();

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
    } else if (pendingUserId) {
      setIsPendingVerification(true);
    } else {
      setIsAuthenticated(false);
      setIsPendingVerification(false);
    }
  };

  const loadUserData = () => {
    const userId = StorageService.getCurrentUserId();
    if (userId) {
      // Load sessions
      const userSessions = StorageService.getSessions();
      setSessions(userSessions);

      // Load profile
      // Assuming profile is stored in localStorage or derived from user
      // For now, we can try to get it from StorageService if it exists, or just use default
      // StorageService.getProfile(userId) ??

      // Let's check if there is a profile service or if we just use local state
      // Based on handleLogout, we have setUserProfile

      // Check if there is a profile key in storage
      const profileKey = `mindtrack.${userId}.profile`;
      const savedProfile = localStorage.getItem(profileKey);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        setUserProfile(null);
      }

      // Load achievements
      const streakData = AnalyticsService.calculateStreaks(userSessions);
      const userAchievements = AchievementService.evaluate(userSessions, streakData);
      setAchievements(userAchievements);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsPendingVerification(false);
    loadUserData();
    setView('home');
  };

  const handleSignupSuccess = () => {
    setIsPendingVerification(true);
  };

  const handleVerifySuccess = () => {
    setIsPendingVerification(false);
    setIsAuthenticated(true);
    loadUserData();
    setView('home');
  };

  const handleLogout = () => {
    StorageService.logout();
    StorageService.clearPendingVerificationUserId();
    setIsAuthenticated(false);
    setIsPendingVerification(false);
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

  const handleEndSession = (session) => {
    setCompletedSession(session);
    StorageService.saveSession(session);

    // Update sessions list
    const updatedSessions = StorageService.getSessions();
    setSessions(updatedSessions);

    // Check achievements
    const streakData = AnalyticsService.calculateStreaks(updatedSessions);
    const newAchievements = AchievementService.evaluate(updatedSessions, streakData);
    setAchievements(newAchievements);

    setView('summary');
    setCurrentSessionConfig(null);
  };

  const handleDiscardSession = () => {
    setCurrentSessionConfig(null);
    setView('home');
  };

  const handleCloseSummary = () => {
    setCompletedSession(null);
    setView('home');
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    setView('detail');
  };

  const handleProfileUpdate = (profile) => {
    setUserProfile(profile);
    // Save profile to storage (if we had a method, for now just state)
    const userId = StorageService.getCurrentUserId();
    if (userId) {
      localStorage.setItem(`mindtrack.${userId}.profile`, JSON.stringify(profile));
    }
  };

  const handleExport = () => {
    const data = {
      sessions,
      userProfile,
      achievements
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindtrack-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isPendingVerification) {
    return <VerifyEmailScreen onVerifySuccess={handleVerifySuccess} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} onSignupSuccess={handleSignupSuccess} />;
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

        {view !== 'running' && view !== 'end' && view !== 'summary' && null /* <Nav /> */}

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
