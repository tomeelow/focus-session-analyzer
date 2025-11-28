import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { formatDuration } from '../utils/format';
import { Smartphone, Utensils, MessageCircle, MoreHorizontal } from 'lucide-react';

export function ActiveSession({ onEndSession }) {
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [distractions, setDistractions] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherReason, setOtherReason] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const logDistraction = (reason) => {
    setDistractions([...distractions, {
      timestamp: Date.now(),
      reason
    }]);
    setShowOtherInput(false);
    setOtherReason('');
  };

  const handleEnd = () => {
    onEndSession({
      startTime,
      endTime: Date.now(),
      totalDuration: elapsed,
      distractions
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Session</h2>
        <div className="text-8xl font-bold tracking-tighter tabular-nums text-gray-900">
          {formatDuration(elapsed)}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-sm text-gray-500">Log a distraction</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all" onClick={() => logDistraction('Phone')}>
            <Smartphone className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700">Phone</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all" onClick={() => logDistraction('Social Media')}>
            <MessageCircle className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700">Social Media</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all" onClick={() => logDistraction('Hunger')}>
            <Utensils className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700">Hunger</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-gray-400 hover:bg-gray-50 transition-all" onClick={() => setShowOtherInput(true)}>
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700">Other</span>
          </Button>
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
                if (e.key === 'Enter') logDistraction(otherReason || 'Other');
                if (e.key === 'Escape') setShowOtherInput(false);
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowOtherInput(false)}>Cancel</Button>
              <Button onClick={() => logDistraction(otherReason || 'Other')}>Log</Button>
            </div>
          </Card>
        </div>
      )}

      <div className="pt-8 w-full flex justify-center">
        <Button variant="danger" className="w-full max-w-xs h-12 text-base" onClick={handleEnd}>
          End Session
        </Button>
      </div>
    </div>
  );
}
