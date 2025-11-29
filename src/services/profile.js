const PROFILE_KEY = 'focusApp.userProfile';

export const ProfileService = {
    getProfile: () => {
        try {
            const stored = localStorage.getItem(PROFILE_KEY);
            return stored ? JSON.parse(stored) : null;
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
