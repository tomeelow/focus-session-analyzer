import React from 'react';
import { BrainIcon } from './BrainIcon';

export const MindtrackLogo = ({ variant = 'full', className = "" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="text-accent">
                <BrainIcon className="w-8 h-8" />
            </div>

            {variant === 'full' && (
                <span className="font-bold text-xl tracking-tight text-text-primary">
                    Mindtrack
                </span>
            )}
        </div>
    );
};
