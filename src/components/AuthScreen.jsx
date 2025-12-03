import { useState } from 'react';
import { StorageService } from '../services/storage';
import { Button } from './Button';
import { MindtrackLogo } from './MindtrackLogo';
import { User, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export function AuthScreen({ onLogin, onSignupSuccess }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const hashPassword = async (password) => {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                // Validation
                if (!formData.email || !formData.password || !formData.confirmPassword) {
                    throw new Error('All fields are required');
                }
                if (formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match');
                }

                // Check if user exists
                const users = StorageService.getUsers();
                if (users.some(u => u.email === formData.email)) {
                    throw new Error('Email already registered');
                }

                // Create user
                const passwordHash = await hashPassword(formData.password);
                const newUser = {
                    id: crypto.randomUUID(),
                    email: formData.email,
                    passwordHash,
                    createdAt: new Date().toISOString(),
                    isVerified: false,
                    verificationCode: StorageService.generateVerificationCode(),
                    verificationCodeCreatedAt: new Date().toISOString()
                };

                StorageService.saveUser(newUser);

                // Migrate data if needed (first user)
                if (users.length === 0) {
                    StorageService.migrateDataIfNeeded(newUser.id);
                }

                // Redirect to verification
                StorageService.setPendingVerificationUserId(newUser.id);
                onSignupSuccess();

            } else {
                // Login
                if (!formData.email || !formData.password) {
                    throw new Error('Please enter email and password');
                }

                const users = StorageService.getUsers();
                const user = users.find(u => u.email === formData.email);

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                const passwordHash = await hashPassword(formData.password);
                if (user.passwordHash !== passwordHash) {
                    throw new Error('Invalid email or password');
                }

                if (!user.isVerified) {
                    StorageService.setPendingVerificationUserId(user.id);
                    onSignupSuccess(); // Redirect to verify screen
                    return; // Stop execution
                }

                // Success
                StorageService.setCurrentUserId(user.id);
                onLogin();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <MindtrackLogo className="justify-center mb-6" />
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                        {mode === 'login' ? 'Welcome back' : 'Create an account'}
                    </h1>
                    <p className="text-text-secondary">
                        Track your focus. Understand your patterns.
                    </p>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-text-primary placeholder:text-text-secondary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-text-primary placeholder:text-text-secondary/50"
                                    />
                                </div>
                            </div>

                            {mode === 'signup' && (
                                <div className="space-y-2 animate-in fade-in height-auto">
                                    <label className="text-sm font-medium text-text-primary" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-text-primary placeholder:text-text-secondary/50"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in fade-in">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : (
                                <span className="flex items-center gap-2">
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'signup' : 'login');
                                    setError('');
                                    setFormData({ email: '', password: '', confirmPassword: '' });
                                }}
                                className="font-medium text-accent hover:underline focus:outline-none"
                            >
                                {mode === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-text-secondary/60">
                    Demo Mode: Passwords are hashed but stored locally. Do not use real passwords.
                </p>
            </div>
        </div>
    );
}
