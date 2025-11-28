const STORAGE_KEY = 'study_sessions';

export const StorageService = {
  getSessions: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    let sessions = data ? JSON.parse(data) : [];
    
    // Migration: Ensure all sessions have new fields
    return sessions.map(session => ({
      ...session,
      sessionType: session.sessionType || 'Study',
      activityLabel: session.activityLabel || '',
      goal: session.goal || '',
      goalStatus: session.goalStatus || (session.goal ? 'not_set' : 'not_set'),
      focusRating: session.focusRating || 0,
      tags: session.tags || [],
      // Migrate old distractions to events if needed, or just treat them as events
      events: session.events || (session.distractions ? session.distractions.map(d => ({
        timestamp: d.timestamp,
        type: 'distraction',
        reason: d.reason
      })) : [])
    }));
  },

  saveSession: (session) => {
    const sessions = StorageService.getSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  clearSessions: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
