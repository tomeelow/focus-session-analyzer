import { useState } from 'react';
import { Card } from './Card';
import { formatDuration, formatTime } from '../utils/format';
import { ChevronRight, Filter } from 'lucide-react';

export function History({ sessions, onSelectSession }) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('');

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary border-2 border-dashed border-border rounded-xl">
        No sessions yet. Start one above!
      </div>
    );
  }

  // Sort by date desc
  const sortedSessions = [...sessions].sort((a, b) => b.startTime - a.startTime);

  // Filter
  const filteredSessions = sortedSessions.filter(session => {
    const matchesType = typeFilter === 'All' || session.sessionType === typeFilter;
    const matchesTag = tagFilter === '' || (session.tags && session.tags.some(t => t.toLowerCase().includes(tagFilter.toLowerCase())));
    return matchesType && matchesTag;
  });

  const sessionTypes = ['All', ...new Set(sessions.map(s => s.sessionType || 'Study'))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Sessions</h3>
        <div className="flex gap-2">
          <select
            className="text-sm border-border rounded-md py-1 pl-2 pr-8 bg-surface text-text-primary"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {sessionTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filter tags..."
            className="text-sm border border-border rounded-md px-2 py-1 w-32 bg-surface text-text-primary placeholder:text-text-secondary"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredSessions.map((session, i) => (
          <Card
            key={i}
            className="p-4 flex items-center justify-between hover:bg-surface-highlight transition-colors cursor-pointer group"
            onClick={() => onSelectSession(session)}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  {new Date(session.startTime).toLocaleDateString()}
                </span>
                <span className="text-xs px-2 py-0.5 bg-surface-highlight rounded-full text-text-secondary">
                  {session.sessionType || 'Study'}
                </span>
              </div>
              <span className="text-sm text-text-secondary">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
                {session.activityLabel && " • " + session.activityLabel}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {session.focusRating && (
                  <span className="flex items-center text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded">
                    ★ {session.focusRating}
                  </span>
                )}
                {session.note && (
                  <span className="text-xs text-text-secondary bg-surface-highlight px-1.5 py-0.5 rounded flex items-center gap-1">
                    📝 Note
                  </span>
                )}
                {session.tags && session.tags.length > 0 && (
                  <div className="flex gap-1">
                    {session.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs text-text-secondary bg-surface-highlight px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                    {session.tags.length > 2 && <span className="text-xs text-text-secondary opacity-70">+{session.tags.length - 2}</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-medium">{formatDuration(session.totalDuration)}</div>
                <div className="text-xs text-text-secondary">
                  {session.events ? session.events.length : (session.distractions ? session.distractions.length : 0)} events
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-border group-hover:text-text-secondary transition-colors" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
