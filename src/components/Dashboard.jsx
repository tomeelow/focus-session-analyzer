import { useMemo } from 'react';
import { Card } from './Card';
import { AnalyticsService } from '../utils/analytics';
import { formatDuration } from '../utils/format';
import { Flame, Trophy, AlertCircle, Calendar } from 'lucide-react';

export function Dashboard({ sessions, achievements }) {
    const stats = useMemo(() => {
        return {
            daily: AnalyticsService.calculateDailyStats(sessions),
            weekly: AnalyticsService.calculateWeeklyStats(sessions),
            streaks: AnalyticsService.calculateStreaks(sessions),
            distractions: AnalyticsService.calculateDistractionInsights(sessions),
            heatmap: AnalyticsService.getHeatmapData(sessions)
        };
    }, [sessions]);

    const recentAchievements = achievements.filter(a => a.unlocked).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-gray-500">Your focus at a glance.</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 space-y-1">
                    <div className="text-xs text-gray-500 font-medium uppercase">Today's Focus</div>
                    <div className="text-2xl font-bold">{formatDuration(stats.daily.totalTime)}</div>
                    <div className="text-xs text-gray-400">{stats.daily.count} sessions</div>
                </Card>
                <Card className="p-4 space-y-1">
                    <div className="text-xs text-gray-500 font-medium uppercase">7 Day Focus</div>
                    <div className="text-2xl font-bold">{formatDuration(stats.weekly.totalTime)}</div>
                    <div className="text-xs text-gray-400">Top: {stats.weekly.mostCommonType}</div>
                </Card>
                <Card className="p-4 space-y-1">
                    <div className="text-xs text-gray-500 font-medium uppercase">Current Streak</div>
                    <div className="flex items-center gap-2">
                        <Flame className={`w-6 h-6 ${stats.streaks.current > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}`} />
                        <div className="text-2xl font-bold">{stats.streaks.current} days</div>
                    </div>
                    <div className="text-xs text-gray-400">Longest: {stats.streaks.longest} days</div>
                </Card>
                <Card className="p-4 space-y-1">
                    <div className="text-xs text-gray-500 font-medium uppercase">Achievements</div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <div className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length} / {achievements.length}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                        {recentAchievements.length > 0 ? `Latest: ${recentAchievements[0].name}` : 'Keep going!'}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left 2/3 */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Activity Heatmap */}
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            Activity (Last 30 Days)
                        </h3>
                        <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                            {stats.heatmap.map((day) => (
                                <div
                                    key={day.date}
                                    title={`${day.date}: ${formatDuration(day.duration)}`}
                                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-sm ${day.level === 0 ? 'bg-gray-100' :
                                            day.level === 1 ? 'bg-green-200' :
                                                day.level === 2 ? 'bg-green-400' :
                                                    'bg-green-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </Card>

                    {/* Distraction Insights */}
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-gray-500" />
                            Distraction Insights
                        </h3>
                        {stats.distractions.insights.length === 0 ? (
                            <p className="text-sm text-gray-500">No distractions recorded yet. Great job!</p>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 text-sm text-orange-800">
                                    <strong>Top Distraction:</strong> {stats.distractions.mostFrequent}
                                </div>
                                <div className="space-y-2">
                                    {stats.distractions.insights.slice(0, 5).map((item) => (
                                        <div key={item.reason} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">{item.reason}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gray-900 rounded-full"
                                                        style={{ width: `${item.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-gray-500 w-8 text-right">{item.count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar - Right 1/3 */}
                <div className="space-y-8">
                    {/* Recent Achievements */}
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-gray-500" />
                            Recent Unlocks
                        </h3>
                        {recentAchievements.length === 0 ? (
                            <p className="text-sm text-gray-500">Complete sessions to unlock achievements!</p>
                        ) : (
                            <div className="space-y-4">
                                {recentAchievements.map(achievement => (
                                    <div key={achievement.id} className="flex gap-3 items-start">
                                        <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{achievement.name}</div>
                                            <div className="text-xs text-gray-500">{achievement.description}</div>
                                            <div className="text-[10px] text-gray-400 mt-1">
                                                {new Date(achievement.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
