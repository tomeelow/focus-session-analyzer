import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Button } from './Button';
import { Card } from './Card';
import { Plus, Trash2, FileText } from 'lucide-react';

const SESSION_TYPES = ['Study', 'Work', 'Creative', 'Planning', 'Chores', 'Other'];

export function TemplateList({ onSelectTemplate }) {
    const [templates, setTemplates] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        sessionType: 'Study',
        activityLabel: '',
        goal: ''
    });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = () => {
        setTemplates(StorageService.getTemplates());
    };

    const handleSave = () => {
        if (!newTemplate.name) return;
        StorageService.saveTemplate(newTemplate);
        loadTemplates();
        setIsCreating(false);
        setNewTemplate({ name: '', sessionType: 'Study', activityLabel: '', goal: '' });
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        StorageService.deleteTemplate(id);
        loadTemplates();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Templates</h3>
                <Button size="sm" onClick={() => setIsCreating(!isCreating)}>
                    <Plus className="w-4 h-4 mr-1" />
                    New Template
                </Button>
            </div>

            {isCreating && (
                <Card className="p-4 space-y-4 border-2 border-gray-100">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Template Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g. Deep Work Morning"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={newTemplate.sessionType}
                                onChange={(e) => setNewTemplate({ ...newTemplate, sessionType: e.target.value })}
                            >
                                {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Activity</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g. Coding"
                                value={newTemplate.activityLabel}
                                onChange={(e) => setNewTemplate({ ...newTemplate, activityLabel: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Default Goal (Optional)</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g. Complete module X"
                            value={newTemplate.goal}
                            onChange={(e) => setNewTemplate({ ...newTemplate, goal: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={!newTemplate.name}>Save Template</Button>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map(template => (
                    <Card
                        key={template.id}
                        className="p-4 hover:border-gray-300 transition-colors cursor-pointer group relative"
                        onClick={() => onSelectTemplate(template)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{template.name}</span>
                            </div>
                            <button
                                onClick={(e) => handleDelete(template.id, e)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full">{template.sessionType}</span>
                            {template.activityLabel && <span>• {template.activityLabel}</span>}
                        </div>
                    </Card>
                ))}

                {templates.length === 0 && !isCreating && (
                    <div className="col-span-full text-center py-8 text-gray-500 border-2 border-dashed border-gray-100 rounded-xl">
                        No templates yet. Create one to start sessions faster!
                    </div>
                )}
            </div>
        </div>
    );
}
