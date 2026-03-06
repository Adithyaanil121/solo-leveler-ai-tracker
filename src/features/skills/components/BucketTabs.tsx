'use client';

import React from 'react';
import { useAppStore } from '@/shared/lib/store';
import type { Bucket } from '@/shared/types';

const buckets: { key: Bucket | 'all'; label: string; icon: string; count?: number }[] = [
    { key: 'all', label: 'All Skills', icon: '✦' },
    { key: 'acquired', label: 'Acquired', icon: '★' },
    { key: 'working_on', label: 'Working On', icon: '⚡' },
    { key: 'planned', label: 'Planned', icon: '🎯' },
];

export default function BucketTabs() {
    const { activeBucket, setActiveBucket, skills } = useAppStore();

    const getCounts = (key: string) => {
        if (key === 'all') return skills.length;
        return skills.filter((s) => s.bucket === key).length;
    };

    return (
        <div className="space-y-1">
            {buckets.map((b) => (
                <button
                    key={b.key}
                    onClick={() => setActiveBucket(b.key)}
                    className={`bucket-tab w-full ${b.key !== 'all' ? b.key.replace('_', '-') : ''} ${activeBucket === b.key ? 'active' : ''
                        }`}
                    aria-label={`${b.label} (${getCounts(b.key)} skills)`}
                    aria-current={activeBucket === b.key ? 'true' : undefined}
                >
                    <span className="text-lg">{b.icon}</span>
                    <span className="flex-1 text-left">{b.label}</span>
                    <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                            background: 'var(--bg-surface)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {getCounts(b.key)}
                    </span>
                </button>
            ))}
        </div>
    );
}
