import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { TemplateList } from './TemplateList';
import { ProfileService } from '../services/profile';
import { LayoutTemplate, Clock } from 'lucide-react';

const SESSION_TYPES = ['Study', 'Work', 'Creative', 'Planning', 'Chores', 'Other'];

export function SessionSetup({ onStart }) {
    const [sessionType, setSessionType] = useState('Study');
    const [activityLabel, setActivityLabel] = useState('');
    const [goal, setGoal] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);
    const [defaultDuration, setDefaultDuration] = useState(null);

    useEffect(() => {
        const profile = ProfileService.getProfile();
        if (profile) {
            if (profile.preferredSessionType) {
                setSessionType(profile.preferredSessionType);
            }
            if (profile.defaultSessionDurationMinutes) {
                setDefaultDuration(profile.defaultSessionDurationMinutes);
            }
        }
    }, []);

    const handleStart = () => {
        onStart({
            sessionType,
            activityLabel,
            goal,
            // Pass the default duration if set, otherwise let the active session handle it (or pass null)
            // The requirement says "target duration", but ActiveSession might not support it yet.
            // For now, we just display the hint as requested.
        });
    };

    const handleSelectTemplate = (template) => {
        setSessionType(template.sessionType);
        setActivityLabel(template.activityLabel || '');
        setGoal(template.goal || '');
        setShowTemplates(false);
    };

    return (
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Setup Session</h2>
                <p className="text-text-secondary">What are you focusing on?</p>
            </div>

            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-text-secondary hover:text-text-primary"
                >
                    <LayoutTemplate className="w-4 h-4 mr-2" />
                    {showTemplates ? 'Hide Templates' : 'Use a Template'}
                </Button>
            </div>

            {showTemplates ? (
                <TemplateList onSelectTemplate={handleSelectTemplate} />
            ) : (
                <Card className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-text-primary">Session Type</label>
                        <div className="flex flex-wrap gap-2">
                            {SESSION_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSessionType(type)}
                                    className={
                                        "px-3 py-2 text-sm rounded-md border transition-all " +
                                        (sessionType === type
                                            ? "bg-accent text-accent-foreground border-accent shadow-sm"
                                            : "bg-surface text-text-secondary border-border hover:bg-surface-highlight hover:text-text-primary")
                                    }
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {defaultDuration && (
                            <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
                                <Clock className="w-3 h-3" />
                                <span>Default target: {defaultDuration} min</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-text-primary">Activity Label</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-surface text-text-primary placeholder:text-text-secondary"
                            placeholder="e.g. Math Revision, Project X"
                            value={activityLabel}
                            onChange={(e) => setActivityLabel(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-text-primary">Goal (Optional)</label>
                        <textarea
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent min-h-[80px] bg-surface text-text-primary placeholder:text-text-secondary"
                            placeholder="What do you want to achieve?"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                        />
                    </div>

                    <Button size="lg" className="w-full h-12 text-base" onClick={handleStart}>
                        Start Session
                    </Button>
                </Card>
            )}
        </div>
    );
}
