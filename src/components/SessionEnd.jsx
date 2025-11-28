import { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Star } from 'lucide-react';

export function SessionEnd({ session, onComplete }) {
    const [focusRating, setFocusRating] = useState(0);
    const [goalStatus, setGoalStatus] = useState(session.goal ? 'not_set' : 'not_set');
    const [tags, setTags] = useState('');

    const handleComplete = () => {
        onComplete({
            ...session,
            focusRating,
            goalStatus,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        });
    };

    return (
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Session Complete</h2>
                <p className="text-gray-500">Take a moment to reflect.</p>
            </div>

            <Card className="p-6 space-y-6">
                {/* Focus Rating */}
                <div className="space-y-3 text-center">
                    <label className="text-sm font-medium text-gray-700">How focused did you feel?</label>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setFocusRating(rating)}
                                className="p-2 transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    className={`w-8 h-8 ${rating <= focusRating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Goal Status */}
                {session.goal && (
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Goal: "{session.goal}"</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['reached', 'partially_reached', 'not_reached'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setGoalStatus(status)}
                                    className={`px-3 py-2 text-sm rounded-md border capitalize ${goalStatus === status
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                )
                }

                {/* Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="e.g. work, project-x, deep-work"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <Button size="lg" className="w-full h-12 text-base" onClick={handleComplete} disabled={focusRating === 0}>
                    Save Session
                </Button>
            </Card >
        </div >
    );
}
