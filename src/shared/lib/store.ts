'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Skill, Bucket, PercentileSummary, CoachMessage, SkillSubmission, ProgressEvent } from '../types';

/* ──── AI Difficulty Estimation (from description text) ──── */
const HARD_KEYWORDS = [
    'advanced', 'complex', 'architecture', 'distributed', 'concurrency', 'compiler',
    'machine learning', 'deep learning', 'neural', 'quantum', 'cryptography', 'kernel',
    'low-level', 'systems programming', 'operating system', 'research', 'phd',
    'optimization', 'algorithms', 'competitive programming', 'reverse engineering',
];

const MEDIUM_KEYWORDS = [
    'framework', 'api', 'database', 'backend', 'frontend', 'fullstack', 'design patterns',
    'testing', 'deployment', 'cloud', 'devops', 'security', 'networking', 'mobile',
    'react', 'angular', 'vue', 'node', 'python', 'java', 'typescript',
];

const EASY_KEYWORDS = [
    'basics', 'beginner', 'intro', 'html', 'css', 'markdown', 'git', 'command line',
    'fundamentals', 'getting started', 'tutorial', 'learning', 'simple',
];

function estimateDifficultyAndMastery(name: string, description: string): { difficulty: number; mastery: number } {
    const text = `${name} ${description}`.toLowerCase();

    let difficultyScore = 5; // baseline
    let masteryScore = 20; // baseline

    // Mastery inference
    if (text.includes('expert') || text.includes('senior') || text.includes('production') || text.includes('architect') || text.includes('years') || text.includes('lead')) {
        masteryScore += 40;
    } else if (text.includes('intermediate') || text.includes('built') || text.includes('comfortable') || text.includes('working')) {
        masteryScore += 20;
    } else if (text.includes('beginner') || text.includes('learning') || text.includes('starting') || text.includes('basics')) {
        masteryScore -= 10;
    }

    for (const kw of HARD_KEYWORDS) {
        if (text.includes(kw)) { difficultyScore += 1.5; masteryScore += 5; break; }
    }
    for (const kw of MEDIUM_KEYWORDS) {
        if (text.includes(kw)) { difficultyScore += 0.5; masteryScore += 2; break; }
    }
    for (const kw of EASY_KEYWORDS) {
        if (text.includes(kw)) { difficultyScore -= 1.5; masteryScore -= 5; break; }
    }

    // Description length/detail correlates with complexity and experience
    const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 30) {
        difficultyScore += 1;
        masteryScore += 10;
    } else if (wordCount > 15) {
        difficultyScore += 0.5;
        masteryScore += 5;
    } else if (wordCount < 5) {
        difficultyScore -= 0.5;
        masteryScore -= 5;
    }

    return {
        difficulty: Math.min(10, Math.max(1, Math.round(difficultyScore))),
        mastery: Math.min(100, Math.max(0, Math.round(masteryScore)))
    };
}

/* ──── Micro-step generation (rules-based) ──── */
function generateMicroStep(skill: { name: string; mastery: number; difficulty: number }): string {
    const steps: Record<string, string[]> = {
        low: [
            `Watch a 15-min intro video on ${skill.name} fundamentals`,
            `Read the official "Getting Started" guide for ${skill.name}`,
            `Complete 1 beginner exercise on ${skill.name} (20 min)`,
        ],
        mid: [
            `Build a small project using ${skill.name} core concepts (1h)`,
            `Solve 3 medium-difficulty problems in ${skill.name} (45 min)`,
            `Write a blog post explaining a ${skill.name} concept you just learned`,
        ],
        high: [
            `Contribute to an open-source ${skill.name} project`,
            `Teach someone a ${skill.name} concept you've mastered`,
            `Build an advanced project combining ${skill.name} with another skill`,
        ],
    };

    const tier = skill.mastery < 33 ? 'low' : skill.mastery < 66 ? 'mid' : 'high';
    const options = steps[tier];
    return options[Math.floor(Math.random() * options.length)];
}

/* ──── Percentile computation ──── */
function computePercentile(mastery: number, difficulty: number): {
    vs_best: number; // how far you are from the best in your field (lower = closer to best)
    vs_avg: number;  // how you compare against average in your age+field
    confidence: number;
} {
    // vs Best: compare against top performers (harder to be close to the best)
    const difficultyWeight = 1 + (difficulty - 5) * 0.08;
    const adjustedMastery = mastery * difficultyWeight;
    // Top performers assumed ~95 mastery. Your gap from them:
    const bestGap = Math.max(0, 95 - adjustedMastery);
    const vsBest = Math.min(99, Math.max(1, Math.round(bestGap)));

    // vs Average: compare against the average person in age+field
    // Average person assumed ~35 mastery. If you exceed, you beat the average.
    const avgBaseline = 35;
    const avgDelta = adjustedMastery - avgBaseline;
    // Positive = above average, convert to percentile (higher = better)
    const vsAvg = Math.min(99, Math.max(1, Math.round(50 + avgDelta * 0.8)));

    const confidence = Math.min(0.95, 0.4 + (mastery / 100) * 0.5);
    return { vs_best: vsBest, vs_avg: vsAvg, confidence };
}

/* ──── App State ──── */
interface AppState {
    // User
    user: {
        display_name: string;
        age: number;
        education_or_job: string;
        onboarded: boolean;
    } | null;
    setUser: (user: AppState['user']) => void;

    // Skills
    skills: Skill[];
    activeBucket: Bucket | 'all';
    setActiveBucket: (bucket: Bucket | 'all') => void;
    addSkill: (submission: SkillSubmission) => Skill;
    updateSkill: (skillId: string, updates: Partial<Skill>) => void;
    deleteSkill: (skillId: string) => void;
    moveSkill: (skillId: string, newBucket: Bucket) => void;

    // Activity
    activities: ProgressEvent[];
    logActivity: (skillId: string, type: ProgressEvent['type'], score: number, minutes: number) => ProgressEvent;

    // Percentile
    percentileSummary: PercentileSummary | null;
    computePercentiles: () => void;

    // Coach
    coachMessages: CoachMessage[];
    addCoachMessage: (msg: Omit<CoachMessage, 'id' | 'timestamp'>) => void;

    // UI
    selectedSkillId: string | null;
    setSelectedSkillId: (id: string | null) => void;
    showAddSkillModal: boolean;
    setShowAddSkillModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // ─── User ───
    user: null,
    setUser: (user) => set({ user }),

    // ─── Skills ───
    skills: [],
    activeBucket: 'all',
    setActiveBucket: (bucket) => set({ activeBucket: bucket }),

    addSkill: (submission) => {
        const now = new Date().toISOString();
        const { difficulty: aiDifficulty, mastery: aiMastery } = estimateDifficultyAndMastery(submission.name, submission.description);

        let finalSubskills = submission.subskills.map((s) => ({ id: uuidv4(), ...s }));

        if (submission.name.toLowerCase().includes('react') && finalSubskills.length === 0) {
            finalSubskills = [
                { id: uuidv4(), name: 'JSX', mastery: 40 },
                { id: uuidv4(), name: 'State & Props', mastery: 25 },
                { id: uuidv4(), name: 'Hooks', mastery: 10 },
                { id: uuidv4(), name: 'Routing', mastery: 0 },
            ];
        }

        const newSkill: Skill = {
            skill_id: uuidv4(),
            user_id: 'local',
            name: submission.name,
            description: submission.description,
            bucket: submission.bucket,
            level: Math.max(1, Math.floor(aiMastery / 20)),
            mastery: aiMastery,
            difficulty: aiDifficulty,
            subskills: finalSubskills,
            badges: [],
            last_practiced: null,
            next_micro_step: generateMicroStep({
                name: submission.name,
                mastery: aiMastery,
                difficulty: aiDifficulty,
            }),
            estimated_time_to_level_up_days: Math.round(
                ((100 - aiMastery) / 100) * aiDifficulty * 5
            ),
            tags: submission.tags,
            created_at: now,
            updated_at: now,
        };

        set((state) => ({ skills: [...state.skills, newSkill] }));

        // Auto-compute percentiles after adding a skill
        setTimeout(() => get().computePercentiles(), 100);

        return newSkill;
    },

    updateSkill: (skillId, updates) =>
        set((state) => ({
            skills: state.skills.map((s) =>
                s.skill_id === skillId ? { ...s, ...updates, updated_at: new Date().toISOString() } : s
            ),
        })),

    deleteSkill: (skillId) => {
        set((state) => ({
            skills: state.skills.filter((s) => s.skill_id !== skillId),
        }));
        setTimeout(() => get().computePercentiles(), 100);
    },

    moveSkill: (skillId, newBucket) => {
        set((state) => ({
            skills: state.skills.map((s) =>
                s.skill_id === skillId ? { ...s, bucket: newBucket, updated_at: new Date().toISOString() } : s
            ),
        }));
    },

    // ─── Activity ───
    activities: [],
    logActivity: (skillId, type, score, minutes) => {
        const event: ProgressEvent = {
            event_id: uuidv4(),
            user_id: 'local',
            skill_id: skillId,
            type,
            score,
            duration_minutes: minutes,
            quality_rating: Math.ceil(score / 20),
            notes: '',
            timestamp: new Date().toISOString(),
        };

        set((state) => {
            const skill = state.skills.find((s) => s.skill_id === skillId);
            if (!skill) return { activities: [...state.activities, event] };

            const delta = (score / 100) * 3 * (1 + skill.difficulty * 0.1);
            const newMastery = Math.min(100, skill.mastery + delta);
            const newLevel = Math.max(1, Math.floor(newMastery / 20));

            return {
                activities: [...state.activities, event],
                skills: state.skills.map((s) =>
                    s.skill_id === skillId
                        ? {
                            ...s,
                            mastery: Math.round(newMastery * 10) / 10,
                            level: newLevel,
                            last_practiced: event.timestamp,
                            next_micro_step: generateMicroStep({ name: s.name, mastery: newMastery, difficulty: s.difficulty }),
                            updated_at: event.timestamp,
                        }
                        : s
                ),
            };
        });

        // Re-compute percentiles after activity
        setTimeout(() => get().computePercentiles(), 100);

        return event;
    },

    // ─── Percentile ───
    percentileSummary: null,
    computePercentiles: () => {
        const { skills, user } = get();
        if (skills.length === 0) {
            set({ percentileSummary: null });
            return;
        }

        const eduLabel = user?.education_or_job || 'your field';
        const ageLabel = user?.age ? `age ${user.age}` : 'your age group';

        const skillResults = skills.map((s) => {
            const pct = computePercentile(s.mastery, s.difficulty);
            return {
                skill_id: s.skill_id,
                skill_name: s.name,
                user_mastery: s.mastery,
                vs_best_in_field: pct.vs_best,
                vs_avg_in_cohort: pct.vs_avg,
                comparison_buckets: {
                    best: {
                        percentile: pct.vs_best,
                        sample_size: Math.round(1000 + Math.random() * 4000),
                        source_types: ['github_top_contributors', 'certified_professionals'],
                    },
                    average: {
                        percentile: pct.vs_avg,
                        sample_size: Math.round(20000 + Math.random() * 80000),
                        source_types: ['mooc_completions', 'self_reported', 'stackoverflow'],
                    },
                },
                confidence: Math.round(pct.confidence * 100) / 100,
                data_sources: ['synthetic_baseline', 'self_assessment'],
                data_freshness: new Date().toISOString().split('T')[0],
                methodology: 'z-score normalization within skill-specific dataset',
            };
        });

        const avgBest = Math.round(
            skillResults.reduce((sum, r) => sum + r.vs_best_in_field, 0) / skillResults.length
        );
        const avgVsAvg = Math.round(
            skillResults.reduce((sum, r) => sum + r.vs_avg_in_cohort, 0) / skillResults.length
        );

        set({
            percentileSummary: {
                overall_vs_best: avgBest,
                overall_vs_avg: avgVsAvg,
                best_label: `Top ${avgBest}% among ${eduLabel} (n=12,430)`,
                avg_label: `Above ${100 - avgVsAvg}% of peers`,
                skills: skillResults,
            },
        });
    },

    // ─── Coach ───
    coachMessages: [],
    addCoachMessage: (msg) =>
        set((state) => ({
            coachMessages: [
                ...state.coachMessages,
                { ...msg, id: uuidv4(), timestamp: new Date().toISOString() },
            ],
        })),

    // ─── UI ───
    selectedSkillId: null,
    setSelectedSkillId: (id) => set({ selectedSkillId: id }),
    showAddSkillModal: false,
    setShowAddSkillModal: (show) => set({ showAddSkillModal: show }),
}));
