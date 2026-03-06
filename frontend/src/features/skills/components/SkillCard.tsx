'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '@/shared/types';
import MasteryRing from './MasteryRing';
import DifficultyDots from './DifficultyDots';
import { useAppStore } from '@/shared/lib/store';
import { FiTrash2 } from 'react-icons/fi';

interface SkillCardProps {
    skill: Skill;
    percentile?: { vs_best: number; vs_avg: number; confidence: number } | null;
}

// Get the UI color theme based on the dynamic percentage thresholds
const getMasteryColorTheme = (mastery: number) => {
    if (mastery <= 30) return { hex: 'var(--accent-orange)', badgeClass: 'orange' }; // early stage / warming up
    if (mastery <= 70) return { hex: 'var(--accent-cyan)', badgeClass: 'cyan' };     // building
    if (mastery <= 90) return { hex: 'var(--accent-emerald)', badgeClass: 'emerald' };  // strong
    return { hex: 'var(--accent-gold)', badgeClass: 'gold' };                        // near mastery
};

export default function SkillCard({ skill, percentile }: SkillCardProps) {
    const { setSelectedSkillId, selectedSkillId, deleteSkill, computePercentiles } = useAppStore();
    const isSelected = selectedSkillId === skill.skill_id;
    const { hex: ringColor, badgeClass } = getMasteryColorTheme(skill.mastery);
    const [showReward, setShowReward] = useState(false);

    const handleQuestClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowReward(true);
        setTimeout(() => setShowReward(false), 2000);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete the skill "${skill.name}"?`)) {
            deleteSkill(skill.skill_id);
            // Recompute percentiles immediately after deletion
            setTimeout(() => computePercentiles(), 50);
        }
    };

    return (
        <motion.div
            className={`relative skill-card purple-flame-border holo-border overflow-visible cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-purple-500/70 shadow-[0_0_30px_rgba(139,92,246,0.2)]' : ''}`}
            onClick={() => setSelectedSkillId(isSelected ? null : skill.skill_id)}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="button"
            aria-label={`${skill.name} skill card, level ${skill.level}, ${skill.mastery}% mastery`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedSkillId(isSelected ? null : skill.skill_id);
                }
            }}
        >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3 relative">
                    <MasteryRing mastery={skill.mastery} size={64} strokeWidth={5} color={ringColor} />
                    {showReward && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -20, scale: 1.1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-2 left-4 text-emerald-400 font-bold text-sm drop-shadow-[0_0_5px_rgba(16,185,129,0.8)] z-50 pointer-events-none"
                        >
                            +2%
                        </motion.div>
                    )}
                    <div>
                        <h3
                            className="text-lg font-bold tracking-wider uppercase"
                            style={{ fontFamily: 'var(--font-display)', color: 'white', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}
                        >
                            {skill.name}
                        </h3>
                        <span className={`level-badge ${badgeClass}`}>
                            Lv.{skill.level}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {/* Percentile Badge */}
                    {percentile && (
                        <div className="text-right">
                            <div
                                className="text-xs font-bold px-2 py-1 rounded-lg cursor-help"
                                style={{
                                    background: 'rgba(139, 92, 246, 0.15)',
                                    color: 'var(--accent-purple)',
                                    fontFamily: 'var(--font-display)',
                                }}
                                title={`You rank in the top ${percentile.vs_best}% compared to experts`}
                            >
                                Top {percentile.vs_best}%
                            </div>
                            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }} title={`Performing better than ${100 - percentile.vs_avg}% of peers`}>
                                Among peers (n=12.4k)
                            </div>
                        </div>
                    )}

                    {/* Delete Button (visible when selected) */}
                    {isSelected && (
                        <button
                            onClick={handleDelete}
                            className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors"
                            aria-label={`Delete ${skill.name}`}
                            title="Delete skill"
                        >
                            <FiTrash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Difficulty
                </span>
                <DifficultyDots
                    difficulty={skill.difficulty}
                    tooltip={skill.difficulty > 7 ? 'Difficulty high because: advanced concepts mapped to this skill' : skill.difficulty > 4 ? 'Moderate difficulty: requires solid fundamentals' : 'Beginner friendly basics'}
                />
            </div>

            {/* Micro Step */}
            <button
                onClick={handleQuestClick}
                className="w-full text-left rounded-xl px-4 py-3 mb-4 relative overflow-hidden group hover:brightness-110 transition-all cursor-pointer"
                style={{
                    background: 'rgba(10, 14, 23, 0.6)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.1)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: 'var(--accent-cyan)' }}>
                            TARGET QUEST
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {skill.next_micro_step}
                        </p>
                    </div>
                    {showReward && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-gold-400 font-bold text-xs text-[#f59e0b] drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] whitespace-nowrap ml-2 pointer-events-none"
                        >
                            +50 XP
                        </motion.div>
                    )}
                </div>
            </button>

            {/* Subskills (collapsed by default, expanded on select) */}
            {isSelected && skill.subskills.length > 0 && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-3"
                >
                    <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                        Sub-skills
                    </div>
                    <div className="space-y-1.5">
                        {skill.subskills.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between">
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {sub.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-1.5 rounded-full"
                                        style={{
                                            width: '60px',
                                            background: 'var(--border-subtle)',
                                        }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${sub.mastery}%`,
                                                background: ringColor,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)', width: '30px', textAlign: 'right' }}>
                                        {sub.mastery}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {skill.last_practiced
                        ? `Practiced ${new Date(skill.last_practiced).toLocaleDateString()}`
                        : 'Not yet practiced'}
                </span>
                {skill.estimated_time_to_level_up_days && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ~{skill.estimated_time_to_level_up_days}d to next level
                    </span>
                )}
            </div>

            {/* 3D Atomic Orbital Rings (visible on hover via CSS) */}
            {/* Moved to the bottom of the DOM to ensure natural z-indexing above card content */}
            <div className="orbital-container">
                <div className="orbital-ring orbital-rx"></div>
                <div className="orbital-ring orbital-ry"></div>
                <div className="orbital-ring orbital-rz"></div>
            </div>
        </motion.div>
    );
}
