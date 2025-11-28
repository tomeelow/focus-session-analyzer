import { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { ActiveSession } from './components/ActiveSession';
import { SessionSetup } from './components/SessionSetup';
import { SessionEnd } from './components/SessionEnd';
import { SessionSummary } from './components/SessionSummary';
import { History } from './components/History';
import { SessionDetail } from './components/SessionDetail';
import { Stats } from './components/Stats';
import { Button } from './components/Button';
import { Play } from 'lucide-react';

function App() {
  const [view, setView] = useState('home'); // home, setup, running, end, summary, detail
  const [sessions, setSessions] = useState([]);
  const [currentSessionConfig, setCurrentSessionConfig] = useState(null);
  const [completedSession, setCompletedSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    setSessions(StorageService.getSessions());
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
    setSessions(StorageService.getSessions());
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

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-8">
        <header className="flex items-center justify-between pb-6 border-b border-gray-100">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-lg">F</span>
            Focus Session Analyzer
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
                  Track your focus sessions, log distractions, and analyze your productivity patterns.
                </p>
                <Button size="lg" className="h-12 px-8 text-base rounded-full" onClick={handleStartSetup}>
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Start Focus Session
                </Button>
              </div>

              <div className="space-y-8">
                <Stats sessions={sessions} />
                <History sessions={sessions} onSelectSession={handleSelectSession} />
              </div>
            </div>
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
            <SessionDetail session={selectedSession} onClose={() => setView('home')} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
