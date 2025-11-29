import { useState, useMemo } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AnalyticsService } from '../utils/analytics';
import { formatDuration } from '../utils/format';
import { ChevronLeft, ChevronRight, X, Clock, Tag } from 'lucide-react';

export function Calendar({ sessions, dayStartHour = 0 }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const { calendarDays, monthLabel } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Mon=0, Sun=6

        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return {
            calendarDays: days,
            monthLabel: firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
    }, [currentDate]);

    const sessionData = useMemo(() => {
        const data = {};
        sessions.forEach(session => {
            const dateKey = AnalyticsService.getUserDayStart(session.startTime, dayStartHour).toISOString().split('T')[0];
            if (!data[dateKey]) {
                data[dateKey] = {
                    totalDuration: 0,
                    sessions: []
                };
            }
            data[dateKey].totalDuration += session.totalDuration;
            data[dateKey].sessions.push(session);
        });
        return data;
    }, [sessions, dayStartHour]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getIntensityClass = (duration) => {
        if (!duration) return 'bg-gray-50 hover:bg-gray-100';
        const minutes = duration / 60;
        if (minutes <= 30) return 'bg-green-100 hover:bg-green-200 text-green-900';
        if (minutes <= 90) return 'bg-green-300 hover:bg-green-400 text-green-900';
        return 'bg-green-500 hover:bg-green-600 text-white';
    };

    const selectedDayData = selectedDay ? sessionData[selectedDay.toISOString().split('T')[0]] : null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Calendar Overview</h2>
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="font-medium min-w-[140px] text-center">{monthLabel}</span>
                    <Button variant="outline" size="sm" onClick={handleNextMonth}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <Card className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, index) => {
                        if (!date) return <div key={`empty-${index}`} className="aspect-square" />;

                        const dateKey = date.toISOString().split('T')[0];
                        const dayData = sessionData[dateKey];
                        const duration = dayData?.totalDuration || 0;

                        return (
                            <button
                                key={dateKey}
                                onClick={() => setSelectedDay(date)}
                                className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${getIntensityClass(duration)}`}
                            >
                                <span className="text-sm font-medium">{date.getDate()}</span>
                                {duration > 0 && (
                                    <span className="text-[10px] opacity-80">
                                        {Math.round(duration / 60)}m
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex items-center justify-end gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gray-50 border border-gray-100"></div>
                        <span>0m</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-100"></div>
                        <span>1-30m</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-300"></div>
                        <span>31-90m</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500"></div>
                        <span>90m+</span>
                    </div>
                </div>
            </Card>

            {/* Day Detail Modal */}
            {selectedDay && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedDay(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Total Focus: {selectedDayData ? formatDuration(selectedDayData.totalDuration) : '0m'}
                                </p>
                            </div>
                            <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                            {!selectedDayData || selectedDayData.sessions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No sessions recorded for this day.
                                </div>
                            ) : (
                                selectedDayData.sessions.map((session, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-gray-50/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-medium text-gray-900">{session.sessionType}</div>
                                                {session.activityLabel && (
                                                    <div className="text-sm text-gray-500">{session.activityLabel}</div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded border border-gray-100 shadow-sm">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                {formatDuration(session.totalDuration)}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {session.goalStatus === 'completed' && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                                    Goal Met
                                                </span>
                                            )}
                                            {session.focusRating && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
                                                    {session.focusRating} ★
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
