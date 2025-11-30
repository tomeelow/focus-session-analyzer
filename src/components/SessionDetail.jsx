import { Button } from './Button';
import { Card } from './Card';
import { formatDuration, formatTime } from '../utils/format';
import { ArrowLeft, Clock, Calendar, Tag, Target, Star, MessageSquare } from 'lucide-react';

export function SessionDetail({ session, onClose }) {
    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={onClose}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h2 className="text-2xl font-bold tracking-tight">Session Details</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-gray-500">Total Duration</div>
                            <div className="text-3xl font-bold text-gray-900">
                                {formatDuration(session.totalDuration)}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Date</div>
                            <div className="font-medium">
                                {new Date(session.startTime).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>Time</span>
                            </div>
                            <span className="font-medium">
                                {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Tag className="w-4 h-4" />
                                <span>Type</span>
                            </div>
                            <span className="px-2 py-1 bg-gray-100 rounded-md text-sm font-medium">
                                {session.sessionType}
                            </span>
                        </div>

                        {session.activityLabel && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Tag className="w-4 h-4" />
                                    <span>Activity</span>
                                </div>
                                <span className="font-medium">{session.activityLabel}</span>
                            </div>
                        )}

                        {session.goal && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Target className="w-4 h-4" />
                                    <span>Goal</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    <div className="font-medium">{session.goal}</div>
                                    {session.goalStatus && session.goalStatus !== 'not_set' && (
                                        <div className={`mt-1 text-xs inline-block px-2 py-0.5 rounded capitalize ${session.goalStatus === 'reached' ? 'bg-green-100 text-green-700' :
                                                session.goalStatus === 'partially_reached' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            } `}>
                                            {session.goalStatus.replace('_', ' ')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {session.focusRating && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Star className="w-4 h-4" />
                                    <span>Focus Rating</span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= session.focusRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {session.tags && session.tags.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Tag className="w-4 h-4" />
                                    <span>Tags</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {session.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="space-y-6">
                    {session.note && (
                        <Card className="p-6 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Reflection Note
                            </h3>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">
                                {session.note}
                            </p>
                        </Card>
                    )}

                    <Card className="p-6">
                        <h3 className="font-semibold mb-4">Session Events</h3>
                        <div className="space-y-4">
                            {session.events && session.events.length > 0 ? (
                                session.events.map((event, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        <div className="min-w-[60px] text-gray-500 font-mono text-xs pt-0.5">
                                            {formatTime(event.timestamp)}
                                        </div>
                                        <div>
                                            <span className={`font-medium ${event.type === 'flow' ? 'text-yellow-600' :
                                                    event.type === 'milestone' ? 'text-green-600' :
                                                        event.type === 'distraction' ? 'text-red-600' :
                                                            'text-blue-600'
                                                }`}>
                                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                            </span>
                                            {event.reason && (
                                                <span className="text-gray-500"> • {event.reason}</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-sm italic">No events logged during this session.</div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
