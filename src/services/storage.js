const STORAGE_KEY_PREFIX = 'mindtrack.';
const USERS_KEY = 'mindtrack.users';
const CURRENT_USER_KEY = 'mindtrack.currentUserId';
const PENDING_VERIFICATION_USER_ID_KEY = 'mindtrack.pendingVerificationUserId';

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
    const users = data ? JSON.parse(data) : [];
    // Default isVerified to true for existing users (migration)
    return users.map(user => ({
      ...user,
      isVerified: user.isVerified !== undefined ? user.isVerified : true
    }));
  },

  saveUser: (user) => {
    const users = StorageService.getUsers();
    // Check if user already exists
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      // Preserve verification fields if updating
      const existingUser = users[existingIndex];
      users[existingIndex] = {
        ...existingUser, // Start with existing user data
        ...user,         // Overlay with new user data
        // Explicitly ensure verification fields are preserved if not provided in 'user'
        isVerified: user.isVerified !== undefined ? user.isVerified : existingUser.isVerified,
        verificationCode: user.verificationCode !== undefined ? user.verificationCode : existingUser.verificationCode,
      };
    } else {
      // New user, add with default verification status and generate code
      users.push({
        ...user,
        isVerified: user.isVerified !== undefined ? user.isVerified : false,
        verificationCode: user.verificationCode || StorageService.generateVerificationCode()
      });
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUserId: () => {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  setCurrentUserId: (userId) => {
    if (userId) {
      localStorage.setItem(CURRENT_USER_KEY, userId);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getPendingVerificationUserId: () => {
    return localStorage.getItem(PENDING_VERIFICATION_USER_ID_KEY);
  },

  setPendingVerificationUserId: (userId) => {
    if (userId) {
      localStorage.setItem(PENDING_VERIFICATION_USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(PENDING_VERIFICATION_USER_ID_KEY);
    }
  },

  clearPendingVerificationUserId: () => {
    localStorage.removeItem(PENDING_VERIFICATION_USER_ID_KEY);
  },

  generateVerificationCode: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    // We don't clear pending verification on logout,
    // as they might want to verify immediately after
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
