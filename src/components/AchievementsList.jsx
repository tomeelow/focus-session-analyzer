import { Card } from './Card';
import { Trophy, Lock } from 'lucide-react';

export function AchievementsList({ achievements }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Achievements</h2>
                <p className="text-gray-500"> milestones you've reached.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                    <Card
                        key={achievement.id}
                        className={`p-4 flex items-start gap-4 transition-colors ${achievement.unlocked ? 'bg-white' : 'bg-gray-50 opacity-75'
                            }`}
                    >
                        <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'
                            }`}>
                            {achievement.unlocked ? <Trophy className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {achievement.name}
                                </h3>
                                {achievement.unlocked && (
                                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                        Unlocked
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                            {achievement.unlocked && (
                                <p className="text-xs text-gray-400 mt-2">
                                    Unlocked on {new Date(achievement.date).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
