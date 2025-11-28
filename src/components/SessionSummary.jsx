import { Button } from './Button';
import { Card } from './Card';
import { formatDuration } from '../utils/format';

export function SessionSummary({ session, onClose }) {
  const distractionCounts = session.distractions.reduce((acc, d) => {
    acc[d.reason] = (acc[d.reason] || 0) + 1;
    return acc;
  }, {});

  // Approximate distraction time: 2 minutes per distraction? Or just show count.
  // Requirement: "% of time “distracted” (approximate: e.g., assume each distraction costs fixed X seconds/minutes or just show count)."
  // I'll assume 2 minutes (120s) per distraction for the calculation.
  const estimatedDistractionTime = session.distractions.length * 120;
  const distractionPercentage = session.totalDuration > 0 
    ? Math.min(100, Math.round((estimatedDistractionTime / session.totalDuration) * 100))
    : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Session Complete</h2>
        <p className="text-gray-500">Here's how you did</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center space-y-1">
          <div className="text-sm text-gray-500 font-medium">Total Focus</div>
          <div className="text-3xl font-bold tracking-tight">{formatDuration(session.totalDuration)}</div>
        </Card>
        <Card className="p-6 text-center space-y-1">
          <div className="text-sm text-gray-500 font-medium">Distractions</div>
          <div className="text-3xl font-bold tracking-tight">{session.distractions.length}</div>
        </Card>
        <Card className="p-6 text-center space-y-1">
          <div className="text-sm text-gray-500 font-medium">Focus Quality</div>
          <div className="text-3xl font-bold tracking-tight">{100 - distractionPercentage}%</div>
          <div className="text-xs text-gray-400">Based on est. loss</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distraction Breakdown</h3>
        {Object.keys(distractionCounts).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No distractions recorded. Great job!</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(distractionCounts).map(([reason, count]) => (
              <div key={reason} className="flex items-center justify-between">
                <span className="text-gray-700">{reason}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-900 rounded-full" 
                      style={{ width: `${(count / session.distractions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{count}</span>
                </div>
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
