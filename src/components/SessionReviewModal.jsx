import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { formatDuration, formatTime } from '../utils/format';
import { Star, X, Clock, Tag, MessageSquare, Target } from 'lucide-react';

const SESSION_TYPES = ['Study', 'Work', 'Creative', 'Planning', 'Chores', 'Other'];

export function SessionReviewModal({ session, onSave, onDiscard, onCancel }) {
    const [sessionType, setSessionType] = useState(session.sessionType || 'Study');
    const [activityLabel, setActivityLabel] = useState(session.activityLabel || '');
    const [goal, setGoal] = useState(session.goal || '');
    const [goalStatus, setGoalStatus] = useState(session.goalStatus || (session.goal ? 'not_set' : 'not_set'));
    const [focusRating, setFocusRating] = useState(session.focusRating || 0);
    const [tags, setTags] = useState(session.tags ? session.tags.join(', ') : '');
    const [note, setNote] = useState(session.note || '');
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

    // Ensure goal status is reset if goal is cleared, or set to default if goal is added
    useEffect(() => {
        if (!goal && goalStatus !== 'not_set') {
            setGoalStatus('not_set');
        } else if (goal && goalStatus === 'not_set') {
            // Default to not_reached or let user choose. 'not_set' is fine as initial state for new goal.
        }
    }, [goal]);

    const handleSave = () => {
        onSave({
            ...session,
            sessionType,
            activityLabel,
            goal,
            goalStatus: goal ? (goalStatus === 'not_set' ? 'not_reached' : goalStatus) : null, // Default to not_reached if ignored but goal exists
            focusRating: focusRating > 0 ? focusRating : null,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            note: note.trim() || null
        });
    };

    if (showDiscardConfirm) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <Card className="w-full max-w-sm p-6 space-y-4 shadow-xl bg-surface">
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Discard Session?</h3>
                    <p className="text-text-secondary">This cannot be undone. The session data will be lost.</p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowDiscardConfirm(false)}>Cancel</Button>
                        <Button variant="danger" onClick={onDiscard}>Discard Forever</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-border">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between bg-surface-highlight">
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">Session Review</h2>
                        <div className="text-sm text-text-secondary flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {formatDuration(session.totalDuration)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-border rounded-full transition-colors text-text-secondary">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1">

                    {/* Type & Label */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Session Type</label>
                            <select
                                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent bg-surface text-text-primary"
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value)}
                            >
                                {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Activity Label</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-accent focus:outline-none bg-surface text-text-primary placeholder:text-text-secondary"
                                placeholder="e.g. Project X"
                                value={activityLabel}
                                onChange={(e) => setActivityLabel(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="space-y-3 p-4 bg-surface-highlight rounded-lg border border-border">
                        <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                            <Target className="w-4 h-4" />
                            Goal
                        </div>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-accent focus:outline-none bg-surface text-text-primary placeholder:text-text-secondary"
                            placeholder="What did you want to achieve?"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                        />
                        {goal && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {['reached', 'partially_reached', 'not_reached'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setGoalStatus(status)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${goalStatus === status
                                            ? 'bg-accent text-accent-foreground border-accent'
                                            : 'bg-surface text-text-secondary border-border hover:border-text-secondary'
                                            }`}
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Focus Rating */}
                    <div className="space-y-2 text-center">
                        <label className="text-sm font-medium text-text-primary">Focus Rating</label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setFocusRating(rating)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    title={rating === 1 ? "Very Distracted" : rating === 5 ? "Laser Focused" : ""}
                                >
                                    <Star
                                        className={`w-8 h-8 ${rating <= focusRating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-border'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-text-secondary h-4">
                            {focusRating === 1 ? "Very Distracted" :
                                focusRating === 3 ? "Average" :
                                    focusRating === 5 ? "Laser Focused" : ""}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                            <Tag className="w-3 h-3" /> Tags
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-accent focus:outline-none bg-surface text-text-primary placeholder:text-text-secondary"
                            placeholder="comma, separated, tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                            <MessageSquare className="w-3 h-3" /> Reflection Note
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-accent focus:outline-none min-h-[80px] resize-y bg-surface text-text-primary placeholder:text-text-secondary"
                            placeholder="What helped or hurt your focus?"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-surface-highlight flex items-center justify-between gap-4">
                    <button
                        onClick={() => setShowDiscardConfirm(true)}
                        className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium px-2"
                    >
                        Discard Session
                    </button>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onCancel}>Back to Timer</Button>
                        <Button onClick={handleSave}>Save Session</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
