/* ──── Core Data Types ──── */

export type Bucket = 'acquired' | 'working_on' | 'planned';

export interface SubSkill {
    id: string;
    name: string;
    mastery: number; // 0-100
}

export interface Skill {
    skill_id: string;
    user_id: string;
    name: string;
    description: string;
    bucket: Bucket;
    level: number;
    mastery: number; // 0-100
    difficulty: number; // 1-10, auto-computed from description
    subskills: SubSkill[];
    badges: string[];
    last_practiced: string | null;
    next_micro_step: string;
    estimated_time_to_level_up_days: number | null;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface ProgressEvent {
    event_id: string;
    user_id: string;
    skill_id: string;
    type: 'practice' | 'test' | 'project' | 'review' | 'quiz';
    score: number;
    duration_minutes: number;
    quality_rating: number;
    notes: string;
    timestamp: string;
}

export interface ComparisonBucket {
    percentile: number;
    sample_size: number;
    source_types?: string[];
}

export interface PercentileResult {
    skill_id: string;
    skill_name: string;
    user_mastery: number;
    vs_best_in_field: number; // how you compare vs top performers in age+field
    vs_avg_in_cohort: number; // how average person in your age+field performs
    comparison_buckets: {
        best: ComparisonBucket; // best performers in field
        average: ComparisonBucket; // average in same age+education
    };
    confidence: number;
    data_sources: string[];
    data_freshness: string;
    methodology: string;
}

export interface PercentileSummary {
    overall_vs_best: number;
    overall_vs_avg: number;
    best_label: string;
    avg_label: string;
    skills: PercentileResult[];
}

export interface CoachMessage {
    id: string;
    role: 'user' | 'coach';
    content: string;
    task?: SuggestedTask;
    resources?: Resource[];
    timestamp: string;
}

export interface SuggestedTask {
    title: string;
    description: string;
    estimated_minutes: number;
    difficulty: number;
    skill_area: string;
}

export interface Resource {
    type: 'article' | 'video' | 'exercise' | 'course';
    title: string;
    url: string;
}

export interface User {
    user_id: string;
    display_name: string;
    email: string;
    age: number;
    education_or_job: string;
    timezone: string;
    consent_for_benchmarks: boolean;
    created_at: string;
}

/* ──── Form types for skill submission ──── */
export interface SkillSubmission {
    name: string;
    description: string; // AI infers difficulty from this
    bucket: Bucket;
    mastery_self_assessment: number;
    subskills: { name: string; mastery: number }[];
    tags: string[];
}

/* ──── Chart data types ──── */
export interface TimelineDataPoint {
    date: string;
    mastery: number;
    activity_count: number;
}

export interface RadarDataPoint {
    skill: string;
    mastery: number;
    fullMark: number;
}
