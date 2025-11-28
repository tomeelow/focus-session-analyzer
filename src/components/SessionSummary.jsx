import { Button } from './Button';
import { Card } from './Card';
import { formatDuration, formatEventType, formatTime } from '../utils/format';
import { Star, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export function SessionSummary({ session, onClose }) {
  const distractionCount = session.events.filter(e => e.type === 'distraction').length;

  // Calculate focus quality based on rating if available, otherwise estimate
  const focusQuality = session.focusRating
    ? session.focusRating * 20
    : Math.max(0, 100 - (distractionCount * 5)); // Fallback estimate

  const getGoalIcon = (status) => {
    switch (status) {
      case 'reached': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'partially_reached': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'not_reached': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Session Saved</h2>
        <p className="text-gray-500">Here's your summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center space-y-1">
          <div className="text-sm text-gray-500 font-medium">Total Focus</div>
          <div className="text-3xl font-bold tracking-tight">{formatDuration(session.totalDuration)}</div>
        </Card>
        <Card className="p-6 text-center space-y-1">
          <div className="text-sm text-gray-500 font-medium">Distractions</div>
          <div className="text-3xl font-bold tracking-tight">{distractionCount}</div>
        </Card>
        <Card className="p-6 text-center space-y-1">
          <div className="text-sm text-gray-500 font-medium">Focus Rating</div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-bold tracking-tight">{session.focusRating || '-'}</span>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </Card>
      </div>

      {session.goal && (
        <Card className="p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 font-medium">Goal</div>
            <div className="font-medium text-gray-900">{session.goal}</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
            {getGoalIcon(session.goalStatus)}
            <span className="text-sm capitalize font-medium text-gray-700">
              {session.goalStatus.replace('_', ' ')}
            </span>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Session Timeline</h3>
        {session.events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No events recorded.</p>
        ) : (
          <div className="relative border-l border-gray-200 ml-3 space-y-6 pb-2">
            {session.events.map((event, i) => (
              <div key={i} className="ml-6 relative">
                <div className="absolute -left-[31px] mt-1.5 h-2.5 w-2.5 rounded-full border border-white bg-gray-300 ring-4 ring-white" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <span className="text-sm font-medium text-gray-900">{formatEventType(event.type)}</span>
                  <span className="text-xs text-gray-500 font-mono">
                    +{formatDuration(Math.floor((event.timestamp - session.startTime) / 1000))}
                  </span>
                </div>
                {event.reason && (
                  <p className="text-sm text-gray-500 mt-0.5">{event.reason}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={onClose}>Back to Home</Button>
      </div>
    </div>
  );
}
