import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Button } from './Button';
import { MindtrackLogo } from './MindtrackLogo';
import { Mail, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export function VerifyEmailScreen({ onVerifySuccess }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [demoCode, setDemoCode] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        loadPendingUser();
    }, []);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const loadPendingUser = () => {
        const userId = StorageService.getPendingVerificationUserId();
        if (!userId) {
            setError('No pending verification found.');
            return;
        }

        const users = StorageService.getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            setError('User not found.');
            return;
        }

        setUserEmail(user.email);
        // For demo purposes, show the code
        setDemoCode(user.verificationCode);
        console.log('DEMO: Verification Code is:', user.verificationCode);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userId = StorageService.getPendingVerificationUserId();
            const users = StorageService.getUsers();
            const user = users.find(u => u.id === userId);

            if (!user) throw new Error('User not found');

            if (code !== user.verificationCode) {
                throw new Error('Invalid verification code');
            }

            // Check expiration (15 minutes)
            if (user.verificationCodeCreatedAt) {
                const createdAt = new Date(user.verificationCodeCreatedAt).getTime();
                const now = new Date().getTime();
                const fifteenMinutes = 15 * 60 * 1000;

                if (now - createdAt > fifteenMinutes) {
                    throw new Error('Verification code has expired. Please request a new one.');
                }
            }

            // Success!
            user.isVerified = true;
            delete user.verificationCode;
            StorageService.saveUser(user);

            StorageService.setCurrentUserId(user.id);
            StorageService.clearPendingVerificationUserId();

            onVerifySuccess();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        if (resendCooldown > 0) return;

        const userId = StorageService.getPendingVerificationUserId();
        const users = StorageService.getUsers();
        const user = users.find(u => u.id === userId);

        if (user) {
            const newCode = StorageService.generateVerificationCode();
            user.verificationCode = newCode;
            user.verificationCodeCreatedAt = new Date().toISOString();
            StorageService.saveUser(user);
            setDemoCode(newCode);
            console.log('DEMO: New Verification Code is:', newCode);
            setResendCooldown(30);
            setError('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <MindtrackLogo className="justify-center mb-6" />
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                        Verify your email
                    </h1>
                    <p className="text-text-secondary">
                        We've sent a code to <span className="font-medium text-text-primary">{userEmail}</span>
                    </p>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm space-y-6">
                    {/* Demo Code Display */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-center">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 uppercase tracking-wider">
                            Demo Mode
                        </p>
                        <p className="text-sm text-text-secondary mb-2">
                            Your verification code is:
                        </p>
                        <p className="text-2xl font-mono font-bold text-accent tracking-widest">
                            {demoCode || '------'}
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary" htmlFor="code">
                                Verification Code
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-text-secondary" />
                                <input
                                    id="code"
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-text-primary placeholder:text-text-secondary/50 font-mono tracking-widest text-lg"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in fade-in">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
                            {loading ? 'Verifying...' : (
                                <span className="flex items-center gap-2">
                                    Verify Email
                                    <CheckCircle2 className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={handleResend}
                            disabled={resendCooldown > 0}
                            className="text-sm font-medium text-text-secondary hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                        >
                            <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                            {resendCooldown > 0
                                ? `Resend code in ${resendCooldown}s`
                                : "Didn't receive a code? Resend"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
