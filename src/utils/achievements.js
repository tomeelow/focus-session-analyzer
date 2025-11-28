export const AchievementService = {
    DEFINITIONS: [
        {
            id: 'firstSession',
            name: 'First Step',
            description: 'Complete your first focus session',
            check: (sessions) => sessions.length >= 1
        },
        {
            id: 'threeSessionsOneDay',
            name: 'Hat Trick',
            description: 'Complete 3 sessions in a single day',
            check: (sessions) => {
                const counts = {};
                sessions.forEach(s => {
                    const date = new Date(s.startTime).toDateString();
                    counts[date] = (counts[date] || 0) + 1;
                });
                return Object.values(counts).some(c => c >= 3);
            }
        },
        {
            id: 'hundredMinutesTotal',
            name: 'Century Club',
            description: 'Accumulate 100 minutes of total focus time',
            check: (sessions) => {
                const totalSecs = sessions.reduce((acc, s) => acc + s.totalDuration, 0);
                return totalSecs >= 100 * 60;
            }
        },
        {
            id: 'noDistractionLongSession',
            name: 'Laser Focus',
            description: 'Complete a 45+ min session with 0 distractions',
            check: (sessions) => {
                return sessions.some(s => {
                    const durationMins = s.totalDuration / 60;
                    const distractionCount = s.events ? s.events.filter(e => e.type === 'distraction').length : 0;
                    return durationMins >= 45 && distractionCount === 0;
                });
            }
        },
        {
            id: 'weekStreak7',
            name: 'Unstoppable',
            description: 'Achieve a 7-day streak',
            check: (sessions, streakData) => {
                // We pass streakData (calculated from AnalyticsService) to avoid recomputing
                return streakData && streakData.longest >= 7;
            }
        }
    ],

    evaluate: (sessions, streakData) => {
        const stored = localStorage.getItem('focus_achievements');
        const unlocked = stored ? JSON.parse(stored) : {};
        let newUnlock = false;

        const results = AchievementService.DEFINITIONS.map(def => {
            const isUnlocked = unlocked[def.id];
            if (isUnlocked) {
                return { ...def, unlocked: true, date: isUnlocked };
            }

            const passed = def.check(sessions, streakData);
            if (passed) {
                unlocked[def.id] = new Date().toISOString();
                newUnlock = true;
                return { ...def, unlocked: true, date: unlocked[def.id] };
            }

            return { ...def, unlocked: false };
        });

        if (newUnlock) {
            localStorage.setItem('focus_achievements', JSON.stringify(unlocked));
        }

        return results;
    }
};
