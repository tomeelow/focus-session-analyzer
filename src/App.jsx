import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { ActiveSession } from './components/ActiveSession';
import { SessionSummary } from './components/SessionSummary';
import { History } from './components/History';
import { Stats } from './components/Stats';
import { Button } from './components/Button';
import { Play } from 'lucide-react';

function App() {
  const [view, setView] = useState('home'); // home, running, summary
  const [sessions, setSessions] = useState([]);
  const [lastSession, setLastSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    setSessions(StorageService.getSessions());
  }, []);

  const handleStartSession = () => {
    setView('running');
  };

  const handleEndSession = (session) => {
    StorageService.saveSession(session);
    setSessions(StorageService.getSessions());
    setLastSession(session);
    setView('summary');
  };

  const handleCloseSummary = () => {
    setView('home');
    setLastSession(null);
    setSelectedSession(null);
  };

  const handleSelectSession = (session) => {
    setLastSession(session);
    setView('summary');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <header className="flex items-center justify-between pb-6 border-b border-gray-100">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-lg">S</span>
            Study Session Analyzer
          </h1>
        </header>

        <main>
          {view === 'home' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="text-center space-y-6 py-8">
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                  Focus on what matters.
                </h2>
                <p className="text-lg text-gray-500 max-w-lg mx-auto">
                  Track your study sessions and understand your distractions to improve your productivity.
                </p>
                <Button size="lg" className="h-12 px-8 text-base rounded-full" onClick={handleStartSession}>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Start Session
                </Button>
              </div>

              <div className="space-y-8">
                <Stats sessions={sessions} />
                <History sessions={sessions} onSelectSession={handleSelectSession} />
              </div>
            </div>
          )}

          {view === 'running' && (
            <ActiveSession onEndSession={handleEndSession} />
          )}

          {view === 'summary' && lastSession && (
            <SessionSummary session={lastSession} onClose={handleCloseSummary} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
