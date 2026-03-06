'use client';

import React from 'react';

interface MasteryRingProps {
    mastery: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    className?: string;
}

export default function MasteryRing({
    mastery,
    size = 80,
    strokeWidth = 6,
    color,
    className = '',
}: MasteryRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (mastery / 100) * circumference;

    // Color based on mastery level
    const ringColor =
        color ||
        (mastery >= 80
            ? 'var(--accent-emerald)'
            : mastery >= 50
                ? 'var(--accent-blue)'
                : mastery >= 25
                    ? 'var(--accent-orange)'
                    : 'var(--danger)');

    return (
        <div
            className={`mastery-ring relative z-10 ${className}`}
            style={{ '--ring-size': `${size}px` } as React.CSSProperties}
            role="progressbar"
            aria-valuenow={mastery}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${mastery}% mastery`}
        >
            {/* The Animated Energy Aura */}
            <div
                className="flame-container"
                style={{ '--flame-color': ringColor } as React.CSSProperties}
            >
                <div className="flame-layer-1" />
                <div className="flame-layer-2" />
                <div className="flame-layer-3" />
            </div>

            <svg width={size} height={size} className="relative z-10 drop-shadow-lg">
                {/* Track */}
                <circle
                    className="ring-track"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="rgba(255, 255, 255, 0.05)"
                />
                {/* Fill */}
                <circle
                    className="ring-fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={ringColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        filter: `drop-shadow(0 0 8px ${ringColor})`,
                    }}
                />
            </svg>
            <span className="ring-label relative z-10 drop-shadow-md" style={{ color: "white" }}>
                {Math.round(mastery)}%
            </span>
        </div>
    );
}
