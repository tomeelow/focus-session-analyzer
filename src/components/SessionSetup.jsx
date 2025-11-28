import { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { TemplateList } from './TemplateList';
import { LayoutTemplate } from 'lucide-react';

const SESSION_TYPES = ['Study', 'Work', 'Creative', 'Planning', 'Chores', 'Other'];

export function SessionSetup({ onStart }) {
    const [sessionType, setSessionType] = useState('Study');
    const [activityLabel, setActivityLabel] = useState('');
    const [goal, setGoal] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);

    const handleStart = () => {
        onStart({
            sessionType,
            activityLabel,
            goal
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
                <p className="text-gray-500">What are you focusing on?</p>
            </div>

            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-gray-600"
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
                        <label className="text-sm font-medium text-gray-700">Session Type</label>
                        <div className="flex flex-wrap gap-2">
                            {SESSION_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSessionType(type)}
                                    className={
                                        "px-3 py-2 text-sm rounded-md border transition-all " +
                                        (sessionType === type
                                            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                                    }
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Activity Label</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="e.g. Math Revision, Project X"
                            value={activityLabel}
                            onChange={(e) => setActivityLabel(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Goal (Optional)</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[80px]"
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
