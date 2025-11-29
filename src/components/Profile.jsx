import { useState, useEffect, useRef } from 'react';
import { ProfileService } from '../services/profile';
import { Button } from './Button';
import { User, Upload, X, Save, Check } from 'lucide-react';

export function Profile(props) {
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        preferredSessionType: '',
        avatarDataUrl: null
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const loadedProfile = ProfileService.getProfile();
        if (loadedProfile) {
            setProfile(prev => ({ ...prev, ...loadedProfile }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatarDataUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setProfile(prev => ({ ...prev, avatarDataUrl: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        const success = ProfileService.saveProfile(profile);
        setIsSaving(false);

        if (success) {
            setMessage({ type: 'success', text: 'Profile saved successfully!' });
            if (props.onProfileUpdate) {
                props.onProfileUpdate(profile);
            }
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: 'Failed to save profile.' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
                <p className="text-gray-500">Manage your personal information and preferences.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-8">

                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                        <div className="relative group">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                                {profile.avatarDataUrl ? (
                                    <img
                                        src={profile.avatarDataUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-gray-300" />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center sm:items-start gap-3">
                            <h3 className="font-medium text-gray-900">Profile Photo</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload
                                </Button>
                                {profile.avatarDataUrl && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveAvatar}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500">Recommended: Square image, at least 400x400px.</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={profile.displayName}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Tell us a little about yourself..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="preferredSessionType" className="text-sm font-medium text-gray-700">
                                Preferred Session Type
                            </label>
                            <select
                                id="preferredSessionType"
                                name="preferredSessionType"
                                value={profile.preferredSessionType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
                            >
                                <option value="">Select a type...</option>
                                <option value="Study">Study</option>
                                <option value="Work">Work</option>
                                <option value="Creative">Creative</option>
                                <option value="Reading">Reading</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                        <div className="h-6">
                            {message && (
                                <span className={`text-sm flex items-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {message.type === 'success' && <Check className="w-4 h-4 mr-1" />}
                                    {message.text}
                                </span>
                            )}
                        </div>
                        <Button onClick={handleSave} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}
