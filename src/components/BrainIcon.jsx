import React from 'react';

export const BrainIcon = ({ className = "" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {/* Left Hemisphere Outline */}
        <path d="M9.5 20.5c-4.5 0-7.5-3.5-7.5-8.5 0-4.5 3-8 7.5-8 1.5 0 3 .5 4 1.5" />

        {/* Right Hemisphere Outline */}
        <path d="M14.5 20.5c4.5 0 7.5-3.5 7.5-8.5 0-4.5-3-8-7.5-8-1.5 0-3 .5-4 1.5" />

        {/* Center Division/Connection */}
        <path d="M12 5.5v15" />

        {/* Internal Details (Gyri/Sulci hints) */}
        <path d="M6 10c.5-1.5 2-2.5 3.5-2.5" />
        <path d="M18 10c-.5-1.5-2-2.5-3.5-2.5" />
        <path d="M7 15c1-1 2.5-1 3.5 0" />
        <path d="M17 15c-1-1-2.5-1-3.5 0" />
    </svg>
);
