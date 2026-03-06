'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/shared/lib/store';

export default function OnboardingModal() {
    const { user, setUser, setShowAddSkillModal } = useAppStore();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [age, setAge] = useState(20);
    const [education, setEducation] = useState('');

    if (user?.onboarded) return null;

    const handleComplete = () => {
        setUser({
            display_name: name || 'User',
            age,
            education_or_job: education || 'Student',
            onboarded: true,
        });
        // Auto-open add skill modal after onboarding
        setTimeout(() => setShowAddSkillModal(true), 500);
    };

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)' }} />
            <motion.div
                className="relative w-full max-w-md rounded-2xl overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25 }}
            >
                {/* Decorative top bar */}
                <div
                    className="h-1.5 w-full"
                    style={{ background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue), var(--accent-cyan))' }}
                />

                <div className="p-6">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                            <div className="text-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="text-5xl mb-3"
                                >
                                    ✦
                                </motion.div>
                                <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-purple)' }}>
                                    SKILL WINDOW
                                </h2>
                                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                                    Welcome. Let&apos;s set up your profile.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Alex"
                                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                    id="onboarding-name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                    Age
                                </label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    min={10}
                                    max={80}
                                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                    id="onboarding-age"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                                    Education / Occupation
                                </label>
                                <input
                                    type="text"
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                    placeholder="e.g. B.Tech 2nd year, Software Engineer 3 YoE..."
                                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                                    id="onboarding-education"
                                />
                                <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                                    This helps compute accurate percentile rankings vs. your peers.
                                </p>
                            </div>

                            <button
                                onClick={handleComplete}
                                className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                    boxShadow: 'var(--glow-purple)',
                                }}
                            >
                                ✦ Enter the Skill Window
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
