const PROFILE_KEY = 'focusApp.userProfile';

export const ProfileService = {
    getProfile: () => {
        try {
            const stored = localStorage.getItem(PROFILE_KEY);
            if (!stored) return null;

            const profile = JSON.parse(stored);
            return {
                ...profile,
                defaultSessionDurationMinutes: profile.defaultSessionDurationMinutes || null,
                dayStartHour: profile.dayStartHour !== undefined ? profile.dayStartHour : 0
            };
        } catch (error) {
            console.error('Failed to load profile:', error);
            return null;
        }
    },

    saveProfile: (profileData) => {
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
            return true;
        } catch (error) {
            console.error('Failed to save profile:', error);
            return false;
        }
    },

    clearAvatar: () => {
        try {
            const profile = ProfileService.getProfile();
            if (profile) {
                profile.avatarDataUrl = null;
                ProfileService.saveProfile(profile);
                return profile;
            }
            return null;
        } catch (error) {
            console.error('Failed to clear avatar:', error);
            return null;
        }
    }
};
