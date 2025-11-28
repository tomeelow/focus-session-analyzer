import { Card } from './Card';
import { formatDuration, formatTime } from '../utils/format';
import { ChevronRight } from 'lucide-react';

export function History({ sessions, onSelectSession }) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
        No sessions yet. Start one above!
      </div>
    );
  }

  // Sort by date desc
  const sortedSessions = [...sessions].sort((a, b) => b.startTime - a.startTime);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Sessions</h3>
      <div className="space-y-2">
        {sortedSessions.map((session, i) => (
          <Card 
            key={i} 
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={() => onSelectSession(session)}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">
                {new Date(session.startTime).toLocaleDateString()}
              </span>
              <span className="text-sm text-gray-500">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-medium">{formatDuration(session.totalDuration)}</div>
                <div className="text-xs text-gray-500">{session.distractions.length} distractions</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
