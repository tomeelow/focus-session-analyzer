const STORAGE_KEY = 'study_sessions';

export const StorageService = {
  getSessions: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
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
