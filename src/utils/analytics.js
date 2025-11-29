import { formatDuration } from './format';

export const AnalyticsService = {
    getUserDayStart: (date, dayStartHour = 0) => {
        const d = new Date(date);
        // If the hour is before the start hour, it belongs to the previous "user day"
        if (d.getHours() < dayStartHour) {
            d.setDate(d.getDate() - 1);
        }
        d.setHours(dayStartHour, 0, 0, 0);
        return d;
    },

    calculateDailyStats: (sessions, dayStartHour = 0) => {
        const todayStart = AnalyticsService.getUserDayStart(new Date(), dayStartHour);
        const nextDayStart = new Date(todayStart);
        nextDayStart.setDate(nextDayStart.getDate() + 1);

        const todaySessions = sessions.filter(s =>
            s.startTime >= todayStart.getTime() && s.startTime < nextDayStart.getTime()
        );

        const totalTime = todaySessions.reduce((acc, s) => acc + s.totalDuration, 0);

        const totalDistractions = todaySessions.reduce((acc, s) => {
            return acc + (s.events ? s.events.filter(e => e.type === 'distraction').length : 0);
        }, 0);

        const totalHours = totalTime / 3600;
        const distractionsPerHour = totalHours > 0 ? (totalDistractions / totalHours).toFixed(1) : 0;

        return {
            totalTime,
            count: todaySessions.length,
            distractionsPerHour
        };
    },

    calculateWeeklyStats: (sessions, dayStartHour = 0) => {
        const todayStart = AnalyticsService.getUserDayStart(new Date(), dayStartHour);
        const weekAgoStart = new Date(todayStart);
        weekAgoStart.setDate(weekAgoStart.getDate() - 7);

        const weeklySessions = sessions.filter(s => s.startTime >= weekAgoStart.getTime());
        const totalTime = weeklySessions.reduce((acc, s) => acc + s.totalDuration, 0);

        // Most common session type
        const typeCounts = {};
        weeklySessions.forEach(s => {
            typeCounts[s.sessionType] = (typeCounts[s.sessionType] || 0) + 1;
        });
        const mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

        return {
            totalTime,
            count: weeklySessions.length,
            mostCommonType: mostCommonType ? mostCommonType[0] : '-'
        };
    },

    calculateStreaks: (sessions, dayStartHour = 0) => {
        if (!sessions.length) return { current: 0, longest: 0 };

        const dates = [...new Set(sessions.map(s => {
            return AnalyticsService.getUserDayStart(s.startTime, dayStartHour).getTime();
        }))].sort((a, b) => b - a); // Descending

        let current = 0;
        let longest = 0;
        let tempLongest = 0;

        // Check if today or yesterday has a session for current streak
        const todayStart = AnalyticsService.getUserDayStart(new Date(), dayStartHour);
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);

        if (dates.includes(todayStart.getTime())) {
            current = 1;
        } else if (dates.includes(yesterdayStart.getTime())) {
            // Streak is still active if last session was yesterday
        } else {
            // Streak broken
            current = 0;
        }

        // Calculate current streak strictly
        let checkDate = new Date(todayStart);
        // If no session today, start checking from yesterday
        if (!dates.includes(todayStart.getTime())) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // If we have a session on checkDate, count backwards
        if (dates.includes(checkDate.getTime())) {
            current = 0;
            while (true) {
                if (dates.includes(checkDate.getTime())) {
                    current++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        } else {
            current = 0;
        }


        // Calculate longest streak
        // Re-sort ascending for easier iteration
        const ascDates = [...dates].sort((a, b) => a - b);
        if (ascDates.length === 0) return { current: 0, longest: 0 };

        tempLongest = 1;
        longest = 1;

        for (let i = 1; i < ascDates.length; i++) {
            const prev = new Date(ascDates[i - 1]);
            const curr = new Date(ascDates[i]);

            const diffTime = Math.abs(curr - prev);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempLongest++;
            } else {
                tempLongest = 1;
            }
            if (tempLongest > longest) longest = tempLongest;
        }

        return { current, longest };
    },

    calculateDistractionInsights: (sessions) => {
        const distractionCounts = {};
        let totalDistractions = 0;

        sessions.forEach(s => {
            if (s.events) {
                s.events.filter(e => e.type === 'distraction').forEach(d => {
                    distractionCounts[d.reason] = (distractionCounts[d.reason] || 0) + 1;
                    totalDistractions++;
                });
            }
        });

        const insights = Object.entries(distractionCounts)
            .map(([reason, count]) => ({
                reason,
                count,
                percentage: totalDistractions > 0 ? Math.round((count / totalDistractions) * 100) : 0
            }))
            .sort((a, b) => b.count - a.count);

        return {
            insights,
            mostFrequent: insights.length > 0 ? insights[0].reason : null
        };
    },

    getHeatmapData: (sessions, dayStartHour = 0) => {
        const data = {};
        const todayStart = AnalyticsService.getUserDayStart(new Date(), dayStartHour);

        // Last 30 days
        for (let i = 29; i >= 0; i--) {
            const d = new Date(todayStart);
            d.setDate(d.getDate() - i);
            data[d.toISOString().split('T')[0]] = 0;
        }

        sessions.forEach(s => {
            const dateKey = AnalyticsService.getUserDayStart(s.startTime, dayStartHour).toISOString().split('T')[0];
            if (data[dateKey] !== undefined) {
                data[dateKey] += s.totalDuration;
            }
        });

        return Object.entries(data).map(([date, duration]) => ({
            date,
            duration,
            level: duration === 0 ? 0 : duration < 1800 ? 1 : duration < 3600 ? 2 : 3
        }));
    }
};
