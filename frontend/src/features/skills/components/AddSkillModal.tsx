'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/shared/lib/store';
import type { Bucket } from '@/shared/types';

const COMMON_SKILLS = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Docker',
    'Machine Learning', 'Data Structures', 'System Design', 'Kubernetes', 'Rust',
    'Go', 'Java', 'C++', 'Swift', 'GraphQL', 'DevOps', 'Cybersecurity',
    'UI/UX Design', 'Product Management', 'Data Analysis', 'Cloud Architecture',
    'Mobile Development', 'Blockchain', 'Web3', 'NLP', 'Computer Vision',
];

export default function AddSkillModal() {
    const { showAddSkillModal, setShowAddSkillModal, addSkill } = useAppStore();

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [bucket, setBucket] = useState<Bucket>('working_on');
    const [subskillInput, setSubskillInput] = useState('');
    const [subskills, setSubskills] = useState<{ name: string; mastery: number }[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [addedSkillResult, setAddedSkillResult] = useState<{
        name: string;
        difficulty: number;
        percentile?: { vs_best: number; vs_avg: number };
    } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSkills = COMMON_SKILLS.filter(
        (s) => s.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const resetForm = () => {
        setStep(1);
        setName('');
        setDescription('');
        setBucket('working_on');
        setSubskills([]);
        setSubskillInput('');
        setTags([]);
        setTagInput('');
        setAddedSkillResult(null);
        setSearchQuery('');
    };

    const handleClose = () => {
        setShowAddSkillModal(false);
        resetForm();
    };

    const handleAddSubskill = () => {
        if (subskillInput.trim()) {
            setSubskills([...subskills, { name: subskillInput.trim(), mastery: 20 }]);
            setSubskillInput('');
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleSubmit = () => {
        const skill = addSkill({
            name,
            description,
            bucket,
            mastery_self_assessment: 0, // Now ignored, inferred by AI
            subskills,
            tags,
        });

        // Get the computed percentile for this skill
        const pctStore = useAppStore.getState().percentileSummary;
        const skillPct = pctStore?.skills.find((s) => s.skill_id === skill.skill_id);

        setAddedSkillResult({
            name: skill.name,
            difficulty: skill.difficulty,
            percentile: skillPct
                ? { vs_best: skillPct.vs_best_in_field, vs_avg: skillPct.vs_avg_in_cohort }
                : undefined,
        });

        setStep(3); // Show result
    };


    if (!showAddSkillModal) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
                    onClick={handleClose}
                />

                {/* Modal */}
                <motion.div
                    className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-card)',
                    }}
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between p-5"
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                        <h2
                            className="text-lg font-bold"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            {step === 3 ? '✦ Skill Registered!' : '✦ Add New Skill'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-xl px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Step Indicator */}
                    {step < 3 && (
                        <div className="flex items-center gap-2 px-5 pt-4">
                            {[1, 2].map((s) => (
                                <div key={s} className="flex items-center gap-2 flex-1">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                                        style={{
                                            background: step >= s ? 'var(--accent-purple)' : 'var(--bg-surface)',
                                            color: step >= s ? 'white' : 'var(--text-muted)',
                                        }}
                                    >
                                        {s}
                                    </div>
                                    {s < 2 && (
                                        <div
                                            className="flex-1 h-0.5 rounded"
                                            style={{ background: step > s ? 'var(--accent-purple)' : 'var(--border-subtle)' }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="p-5">
                        {/* ──── Step 1: Skill Name, Description & Bucket ──── */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Skill Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); setSearchQuery(e.target.value); }}
                                        placeholder="e.g. Python, React, System Design..."
                                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
                                        style={{
                                            background: 'var(--bg-surface)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                        }}
                                        autoFocus
                                        id="skill-name-input"
                                    />
                                    {/* Autocomplete suggestions */}
                                    {searchQuery && !COMMON_SKILLS.includes(name) && filteredSkills.length > 0 && (
                                        <div
                                            className="mt-2 rounded-xl overflow-hidden max-h-32 overflow-y-auto"
                                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                                        >
                                            {filteredSkills.slice(0, 6).map((s) => (
                                                <button
                                                    key={s}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                                                    style={{ color: 'var(--text-secondary)' }}
                                                    onClick={() => { setName(s); setSearchQuery(''); }}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Describe your experience
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What have you learned? What projects have you worked on? What areas are you familiar with? The more detail you provide, the better our AI can assess difficulty and give personalized recommendations."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors resize-none"
                                        style={{
                                            background: 'var(--bg-surface)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                        }}
                                        id="skill-description-input"
                                    />
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                        Our AI will analyze your description to determine skill difficulty and give better recommendations.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Status
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['acquired', 'working_on', 'planned'] as Bucket[]).map((b) => (
                                            <button
                                                key={b}
                                                onClick={() => setBucket(b)}
                                                className={`bucket-tab ${b.replace('_', '-')} ${bucket === b ? 'active' : ''}`}
                                                style={{ justifyContent: 'center', fontSize: '0.8rem' }}
                                            >
                                                {b === 'acquired' ? '★ Acquired' : b === 'working_on' ? '⚡ Working' : '🎯 Planned'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => name.trim() && setStep(2)}
                                    disabled={!name.trim()}
                                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                                    style={{
                                        background: name.trim() ? 'var(--accent-purple)' : 'var(--bg-surface)',
                                        color: name.trim() ? 'white' : 'var(--text-muted)',
                                        cursor: name.trim() ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    Continue →
                                </button>
                            </motion.div>
                        )}



                        {/* ──── Step 2: Subskills & Tags ──── */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                {/* Subskills */}
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Sub-skills <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={subskillInput}
                                            onChange={(e) => setSubskillInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubskill()}
                                            placeholder="e.g. Data Structures, OOP..."
                                            className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                            id="subskill-input"
                                        />
                                        <button
                                            onClick={handleAddSubskill}
                                            className="px-3 py-2 rounded-lg text-sm font-medium"
                                            style={{ background: 'var(--accent-blue)', color: 'white' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {subskills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {subskills.map((sub, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                                                    style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                                                >
                                                    {sub.name}
                                                    <button
                                                        onClick={() => setSubskills(subskills.filter((_, idx) => idx !== i))}
                                                        className="ml-1 hover:text-red-400"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                        Tags <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                            placeholder="e.g. backend, ml, frontend..."
                                            className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                            id="tag-input"
                                        />
                                        <button
                                            onClick={handleAddTag}
                                            className="px-3 py-2 rounded-lg text-sm font-medium"
                                            style={{ background: 'var(--accent-emerald)', color: 'white' }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                                                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                                                >
                                                    #{tag}
                                                    <button
                                                        onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                                                        className="ml-1 hover:text-red-400"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                                        style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                            boxShadow: 'var(--glow-purple)',
                                        }}
                                    >
                                        ✦ Register & Analyze
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* ──── Step 3: Result with Auto-Percentile ──── */}
                        {step === 3 && addedSkillResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-5 py-4"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="text-5xl"
                                >
                                    ✦
                                </motion.div>

                                <div>
                                    <h3
                                        className="text-xl font-bold mb-1"
                                        style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-gold)' }}
                                    >
                                        {addedSkillResult.name}
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        has been added to your Skill Window
                                    </p>
                                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                        AI-assessed difficulty: <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-display)' }}>{addedSkillResult.difficulty}/10</span>
                                    </p>
                                </div>

                                {addedSkillResult.percentile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="rounded-xl p-5"
                                        style={{
                                            background: 'var(--bg-surface)',
                                            border: '1px solid var(--border-subtle)',
                                            boxShadow: 'var(--glow-purple)',
                                        }}
                                    >
                                        <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                                            🤖 AI ANALYSIS
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div
                                                    className="text-2xl font-bold"
                                                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-purple)' }}
                                                >
                                                    {addedSkillResult.percentile.vs_best}%
                                                </div>
                                                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                                    gap from top performers
                                                </div>
                                            </div>
                                            <div>
                                                <div
                                                    className="text-2xl font-bold"
                                                    style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}
                                                >
                                                    Top {100 - addedSkillResult.percentile.vs_avg}%
                                                </div>
                                                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                                    vs avg in your cohort
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                                            ⓘ Based on self-assessment + synthetic baseline. Accuracy improves with activity logging.
                                        </div>
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                    style={{ background: 'var(--accent-purple)' }}
                                >
                                    View Skill Window →
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
