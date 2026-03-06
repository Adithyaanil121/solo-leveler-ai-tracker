'use client';

import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
    AreaChart,
} from 'recharts';
import { useAppStore } from '@/shared/lib/store';

export default function TimelineChart() {
    const { skills, activities, selectedSkillId } = useAppStore();

    const data = useMemo(() => {
        const relevantActivities = selectedSkillId
            ? activities.filter((a) => a.skill_id === selectedSkillId)
            : activities;

        if (relevantActivities.length === 0) {
            // Generate sample data for empty state
            const now = Date.now();
            return Array.from({ length: 7 }, (_, i) => ({
                date: new Date(now - (6 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                mastery: 0,
                activity: 0,
            }));
        }

        // Group by date
        const grouped: Record<string, { mastery: number; count: number }> = {};
        relevantActivities.forEach((a) => {
            const dateKey = new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!grouped[dateKey]) grouped[dateKey] = { mastery: 0, count: 0 };
            grouped[dateKey].mastery = Math.max(grouped[dateKey].mastery, a.score);
            grouped[dateKey].count += 1;
        });

        const finalData = Object.entries(grouped).map(([date, val]) => ({
            date,
            mastery: val.mastery,
            masteryProjection: undefined as number | undefined,
            activity: val.count,
            isProjection: false,
        }));

        if (selectedSkillId) {
            const skill = skills.find(s => s.skill_id === selectedSkillId);
            if (skill && finalData.length > 0) {
                const lastEntry = finalData[finalData.length - 1];
                lastEntry.masteryProjection = lastEntry.mastery; // Anchor for the dotted line

                const daysToNextLevel = skill.estimated_time_to_level_up_days || 14;
                const nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + daysToNextLevel);

                finalData.push({
                    date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    mastery: undefined as any,
                    masteryProjection: Math.min(100, lastEntry.mastery + 15),
                    activity: 0,
                    isProjection: true,
                });
            }
        }

        return finalData;
    }, [activities, selectedSkillId]);

    const selectedSkill = selectedSkillId ? skills.find((s) => s.skill_id === selectedSkillId) : null;

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    📈 {selectedSkill ? `${selectedSkill.name} Timeline` : 'Activity Timeline'}
                </h4>
                {selectedSkill && (
                    <div className="flex gap-2">
                        <div className="text-[10px] font-bold px-2 py-1 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                            🔥 12 Day Streak
                        </div>
                        <div className="text-[10px] font-bold px-2 py-1 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                            ⚡ 450 XP/wk
                        </div>
                        <div className="text-[10px] font-bold px-2 py-1 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            At current pace → Lv.{selectedSkill.level + 1} in {selectedSkill.estimated_time_to_level_up_days || 14}d
                        </div>
                    </div>
                )}
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="masteryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={{ stroke: '#1e293b' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={{ stroke: '#1e293b' }}
                        tickLine={false}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--bg-card)',
                            border: '1px solid #1e293b',
                            borderRadius: '12px',
                            color: '#f1f5f9',
                            fontSize: 12,
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="mastery"
                        stroke="#8b5cf6"
                        fill="url(#masteryGradient)"
                        strokeWidth={2}
                        connectNulls={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="masteryProjection"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        connectNulls={true}
                    />
                    <Line
                        type="monotone"
                        dataKey="activity"
                        stroke="#06b6d4"
                        strokeWidth={1.5}
                        dot={{ r: 3, fill: '#06b6d4' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
