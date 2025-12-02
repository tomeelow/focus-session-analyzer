const STORAGE_KEY_PREFIX = 'mindtrack.';
const USERS_KEY = 'mindtrack.users';
const CURRENT_USER_KEY = 'mindtrack.currentUserId';

// Helper to get the key for the current user
const getUserKey = (suffix) => {
  const userId = StorageService.getCurrentUserId();
  if (!userId) return null;
  return `${STORAGE_KEY_PREFIX}${userId}.${suffix}`;
};

export const StorageService = {
  // --- User Management ---

  getUsers: () => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user) => {
    const users = StorageService.getUsers();
    // Check if user already exists
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUserId: () => {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  setCurrentUserId: (userId) => {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // --- Migration ---

  // Migrate legacy single-user data to the first user
  migrateDataIfNeeded: (newUserId) => {
    // Check for legacy keys
    const legacySessions = localStorage.getItem('study_sessions');
    const legacyTemplates = localStorage.getItem('focus_templates');
    const legacyProfile = localStorage.getItem('focus_profile'); // Assuming this might exist or be added later

    if (legacySessions || legacyTemplates || legacyProfile) {
      // Move to new user keys
      if (legacySessions) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${newUserId}.sessions`, legacySessions);
        localStorage.removeItem('study_sessions');
      }
      if (legacyTemplates) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${newUserId}.templates`, legacyTemplates);
        localStorage.removeItem('focus_templates');
      }
      if (legacyProfile) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${newUserId}.profile`, legacyProfile);
        localStorage.removeItem('focus_profile');
      }
      return true; // Migration occurred
    }
    return false;
  },

  // --- Data Access (Scoped to Current User) ---

  getSessions: () => {
    const key = getUserKey('sessions');
    if (!key) return []; // No user logged in

    const data = localStorage.getItem(key);
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
    const key = getUserKey('sessions');
    if (!key) throw new Error("No user logged in");

    const sessions = StorageService.getSessions();
    sessions.push(session);
    localStorage.setItem(key, JSON.stringify(sessions));
  },

  clearSessions: () => {
    const key = getUserKey('sessions');
    if (key) {
      localStorage.removeItem(key);
    }
  },

  // Templates
  getTemplates: () => {
    const key = getUserKey('templates');
    if (!key) return [];

    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveTemplate: (template) => {
    const key = getUserKey('templates');
    if (!key) throw new Error("No user logged in");

    const templates = StorageService.getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);

    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push({ ...template, id: Date.now().toString() });
    }

    localStorage.setItem(key, JSON.stringify(templates));
  },

  deleteTemplate: (id) => {
    const key = getUserKey('templates');
    if (!key) return;

    const templates = StorageService.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(key, JSON.stringify(templates));
  }
};
