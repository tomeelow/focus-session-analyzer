import { Card } from './Card';
import { formatDuration } from '../utils/format';

export function Stats({ sessions }) {
  const calculateStats = (days) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = sessions.filter(s => s.startTime >= cutoff);

    const totalTime = filtered.reduce((acc, s) => acc + s.totalDuration, 0);
    const totalDistractions = filtered.reduce((acc, s) => {
      if (s.events) {
        return acc + s.events.filter(e => e.type === 'distraction').length;
      }
      return acc + (s.distractions ? s.distractions.length : 0);
    }, 0);
    const totalHours = totalTime / 3600;

    // Distractions per hour
    const distractionsPerHour = totalHours > 0
      ? (totalDistractions / totalHours).toFixed(1)
      : 0;

    // Most common distraction
    const counts = {};
    filtered.forEach(s => {
      if (s.events) {
        s.events.filter(e => e.type === 'distraction').forEach(d => {
          counts[d.reason] = (counts[d.reason] || 0) + 1;
        });
      } else if (s.distractions) {
        s.distractions.forEach(d => {
          counts[d.reason] = (counts[d.reason] || 0) + 1;
        });
      }
    });

    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalTime,
      distractionsPerHour,
      mostCommon: mostCommon ? mostCommon[0] : '-'
    };
  };

  const last7 = calculateStats(7);
  const last30 = calculateStats(30);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsGroup title="Last 7 Days" stats={last7} />
        <StatsGroup title="Last 30 Days" stats={last30} />
      </div>
    </div>
  );
}

function StatsGroup({ title, stats }) {
  return (
    <Card className="p-5 space-y-4">
      <h4 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">{title}</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Focus Time</div>
          <div className="text-xl font-bold">{formatDuration(stats.totalTime)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Distr/Hour</div>
          <div className="text-xl font-bold">{stats.distractionsPerHour}</div>
        </div>
        <div className="col-span-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Top Distraction</div>
          <div className="text-xl font-bold truncate">{stats.mostCommon}</div>
        </div>
      </div>
    </Card>
  );
}
