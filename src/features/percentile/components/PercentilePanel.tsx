'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/shared/lib/store';

export default function PercentilePanel() {
    const { percentileSummary, skills } = useAppStore();

    if (!percentileSummary || skills.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Add skills to see your performance metrics
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Overall Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.08))',
                    border: '1px solid rgba(139,92,246,0.2)',
                }}
            >
                <div
                    className="text-sm font-bold mb-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-purple)' }}
                >
                    {percentileSummary.best_label}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {percentileSummary.avg_label}
                </div>
            </motion.div>

            {/* Per-Skill Percentiles */}
            <div className="space-y-2">
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Skills Breakdown
                </h4>
                {percentileSummary.skills.map((pct, i) => (
                    <motion.div
                        key={pct.skill_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                    >
                        <div className="flex-1">
                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                {pct.skill_name}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Mastery: {pct.user_mastery}% · Confidence: {Math.round(pct.confidence * 100)}%
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-purple)' }}>
                                {pct.vs_best_in_field}% to Best
                            </div>
                            <div className="text-xs" style={{ color: 'var(--accent-cyan)' }}>
                                Top {100 - pct.vs_avg_in_cohort}% vs Avg
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Methodology Disclosure */}
            <details className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <summary className="cursor-pointer hover:text-white transition-colors">
                    ⓘ How percentiles are computed
                </summary>
                <div className="mt-2 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                    <p>Scores are normalized using z-score within skill-specific benchmark datasets, grouped by your age and field.
                        "To Best" indicates how close you are to the top 1% performers.
                        "Vs Avg" shows your percentile ranking compared to an average learner in your cohort.</p>
                    <p className="mt-2">Sample sizes and data freshness are estimated based on available data — actual rankings may differ slightly.</p>
                </div>
            </details>
        </div>
    );
}
