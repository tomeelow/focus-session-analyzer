import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { formatDuration } from '../utils/format';
import { Smartphone, Utensils, MessageCircle, MoreHorizontal, Zap, Flag, Coffee, Play } from 'lucide-react';

export function ActiveSession({ initialConfig, onEndSession }) {
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [events, setEvents] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const logEvent = (type, reason = '') => {
    setEvents([...events, {
      timestamp: Date.now(),
      type,
      reason
    }]);

    if (type === 'distraction') {
      setShowOtherInput(false);
      setOtherReason('');
    }
  };

  const toggleBreak = () => {
    if (isOnBreak) {
      logEvent('break_end');
      setIsOnBreak(false);
    } else {
      logEvent('break_start');
      setIsOnBreak(true);
    }
  };

  const handleEnd = () => {
    if (isOnBreak) {
      logEvent('break_end'); // Auto-end break if session ends
    }
    onEndSession({
      ...initialConfig,
      startTime,
      endTime: Date.now(),
      totalDuration: elapsed,
      events
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {initialConfig.sessionType} {initialConfig.activityLabel && "• " + initialConfig.activityLabel}
        </h2>
        <div className="text-8xl font-bold tracking-tighter tabular-nums text-gray-900">
          {formatDuration(elapsed)}
        </div>
        {initialConfig.goal && (
          <p className="text-gray-500 text-sm max-w-md mx-auto">Goal: {initialConfig.goal}</p>
        )}
        {isOnBreak && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            <Coffee className="w-4 h-4 mr-2" />
            On Break
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Micro-events */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="secondary" className="h-16 flex flex-col gap-1" onClick={() => logEvent('flow')}>
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-xs">Flow</span>
          </Button>
          <Button variant="secondary" className="h-16 flex flex-col gap-1" onClick={() => logEvent('milestone')}>
            <Flag className="w-5 h-5 text-green-500" />
            <span className="text-xs">Milestone</span>
          </Button>
          <Button variant={isOnBreak ? "primary" : "secondary"} className="h-16 flex flex-col gap-1" onClick={toggleBreak}>
            {isOnBreak ? <Play className="w-5 h-5" /> : <Coffee className="w-5 h-5 text-blue-500" />}
            <span className="text-xs">{isOnBreak ? "Resume" : "Break"}</span>
          </Button>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-center text-sm text-gray-500 mb-4">Log a distraction</p>
          <div className="grid grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-gray-50" onClick={() => logEvent('distraction', 'Phone')}>
              <Smartphone className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Phone</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-gray-50" onClick={() => logEvent('distraction', 'Social Media')}>
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Social</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-gray-50" onClick={() => logEvent('distraction', 'Hunger')}>
              <Utensils className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Hunger</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-gray-50" onClick={() => setShowOtherInput(true)}>
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600">Other</span>
            </Button>
          </div>
        </div>
      </div>

      {showOtherInput && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <Card className="w-full max-w-sm p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold">What distracted you?</h3>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Reason..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') logEvent('distraction', otherReason || 'Other');
                if (e.key === 'Escape') setShowOtherInput(false);
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowOtherInput(false)}>Cancel</Button>
              <Button onClick={() => logEvent('distraction', otherReason || 'Other')}>Log</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="pt-4 w-full flex justify-center">
        <Button variant="danger" className="w-full max-w-xs h-12 text-base" onClick={handleEnd}>
          End Session
        </Button>
      </div>
    </div>
  );
}
