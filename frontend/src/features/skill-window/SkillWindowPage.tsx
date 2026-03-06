'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/shared/lib/store';
import BucketTabs from '@/features/skills/components/BucketTabs';
import SkillCard from '@/features/skills/components/SkillCard';
import AddSkillModal from '@/features/skills/components/AddSkillModal';
import TimelineChart from '@/features/charts/components/TimelineChart';
import RadarChart from '@/features/charts/components/RadarChart';
import CoachWidget from '@/features/coach/components/CoachWidget';
import PercentilePanel from '@/features/percentile/components/PercentilePanel';
import OnboardingModal from '@/features/onboarding/components/OnboardingModal';

type InsightTab = 'timeline' | 'radar' | 'percentile' | 'coach';

export default function SkillWindowPage() {
    const {
        skills,
        activeBucket,
        setShowAddSkillModal,
        percentileSummary,
        user,
    } = useAppStore();

    const [insightTab, setInsightTab] = useState<InsightTab>('timeline');

    const filteredSkills =
        activeBucket === 'all' ? skills : skills.filter((s) => s.bucket === activeBucket);

    const getPercentile = (skillId: string) => {
        const pct = percentileSummary?.skills.find((p) => p.skill_id === skillId);
        return pct
            ? { vs_best: pct.vs_best_in_field, vs_avg: pct.vs_avg_in_cohort, confidence: pct.confidence }
            : null;
    };

    return (
        <>
            <OnboardingModal />
            <AddSkillModal />

            <div className="relative z-10 min-h-screen">
                {/* ──── Header ──── */}
                <header
                    className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
                    style={{
                        background: 'rgba(10, 14, 23, 0.8)',
                        backdropFilter: 'blur(16px)',
                        borderBottom: '1px solid var(--border-subtle)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl" style={{ color: 'var(--accent-purple)' }}>✦</span>
                        <h1
                            className="text-lg font-bold tracking-wider"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            SKILL WINDOW
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {percentileSummary && (
                            <div
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl"
                                style={{
                                    background: 'rgba(139,92,246,0.12)',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                }}
                            >
                                <span className="text-lg">🏆</span>
                                <span
                                    className="text-sm font-bold"
                                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-purple)' }}
                                >
                                    {percentileSummary.best_label}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={() => setShowAddSkillModal(true)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                boxShadow: 'var(--glow-purple)',
                            }}
                            id="add-skill-button"
                        >
                            + Add Skill
                        </button>

                        {user && (
                            <div
                                className="hidden md:block text-sm font-medium px-3 py-1.5 rounded-lg"
                                style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                            >
                                {user.display_name}
                            </div>
                        )}
                    </div>
                </header>

                {/* ──── Main Content: 3-Column Layout ──── */}
                <div className="flex flex-col lg:flex-row gap-0 lg:gap-0" style={{ minHeight: 'calc(100vh - 65px)' }}>
                    {/* LEFT: Bucket Sidebar */}
                    <aside
                        className="w-full lg:w-56 p-4 lg:p-5 flex-shrink-0 lg:sticky lg:top-[65px]"
                        style={{ borderRight: '1px solid var(--border-subtle)', maxHeight: 'calc(100vh - 65px)', overflowY: 'auto', background: 'var(--bg-dark)' }}
                    >
                        <BucketTabs />

                        {/* Overall Stats */}
                        {skills.length > 0 && (
                            <div className="mt-6 space-y-3">
                                <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                    OVERVIEW
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                                    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Mastery</div>
                                        <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-purple)' }}>
                                            {Math.round(skills.reduce((s, sk) => s + sk.mastery, 0) / skills.length)}%
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Skills</div>
                                        <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-blue)' }}>
                                            {skills.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* CENTER: Skill Cards Grid */}
                    <main className="flex-1 p-4 lg:p-6 overflow-y-auto" style={{ background: 'var(--bg-dark)' }}>
                        {filteredSkills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <div className="text-5xl mb-4" style={{ color: 'var(--accent-purple)' }}>✦</div>
                                <h3
                                    className="text-lg font-bold mb-2"
                                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                                >
                                    {skills.length === 0 ? 'No Skills Yet' : 'No Skills in This Bucket'}
                                </h3>
                                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                                    {skills.length === 0
                                        ? "Add your first skill to begin your journey."
                                        : "Switch buckets or add a new skill."}
                                </p>
                                <button
                                    onClick={() => setShowAddSkillModal(true)}
                                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                        boxShadow: 'var(--glow-purple)',
                                    }}
                                >
                                    + Add Your First Skill
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredSkills.map((skill) => (
                                        <SkillCard
                                            key={skill.skill_id}
                                            skill={skill}
                                            percentile={getPercentile(skill.skill_id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </main>

                    {/* RIGHT: Insights Panel */}
                    <aside
                        className="w-full lg:w-80 xl:w-96 p-4 lg:p-5 flex-shrink-0 lg:sticky lg:top-[65px]"
                        style={{ borderLeft: '1px solid var(--border-subtle)', maxHeight: 'calc(100vh - 65px)', overflowY: 'auto', background: 'var(--bg-dark)' }}
                    >
                        {/* Tab Switcher */}
                        <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                            {([
                                { key: 'timeline', label: '📈' },
                                { key: 'radar', label: '🎯' },
                                { key: 'percentile', label: '🏆' },
                                { key: 'coach', label: '🤖' },
                            ] as { key: InsightTab; label: string }[]).map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setInsightTab(tab.key)}
                                    className="flex-1 py-2 rounded-lg text-center text-sm font-medium transition-all"
                                    style={{
                                        background: insightTab === tab.key ? 'var(--accent-purple)' : 'transparent',
                                        color: insightTab === tab.key ? 'white' : 'var(--text-muted)',
                                    }}
                                    aria-label={tab.key}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {insightTab === 'timeline' && <TimelineChart />}
                        {insightTab === 'radar' && <RadarChart />}
                        {insightTab === 'percentile' && <PercentilePanel />}
                        {insightTab === 'coach' && <CoachWidget />}
                    </aside>
                </div>
            </div>
        </>
    );
}
