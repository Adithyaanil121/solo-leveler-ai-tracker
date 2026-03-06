'use client';

import React from 'react';

interface DifficultyDotsProps {
    difficulty: number; // 1-10
    max?: number;
    tooltip?: string;
}

export default function DifficultyDots({ difficulty, max = 10, tooltip }: DifficultyDotsProps) {
    return (
        <div
            className={`difficulty-dots ${tooltip ? 'cursor-help' : ''}`}
            aria-label={`Difficulty ${difficulty} of ${max}`}
            title={tooltip || `Difficulty level: ${difficulty}/${max}`}
        >
            {Array.from({ length: max }, (_, i) => (
                <span
                    key={i}
                    className={`difficulty-dot ${i < difficulty ? 'filled' : ''}`}
                />
            ))}
        </div>
    );
}
