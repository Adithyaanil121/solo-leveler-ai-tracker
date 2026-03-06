'use client';

import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    RadarChart as RechartsRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
} from 'recharts';
import { useAppStore } from '@/shared/lib/store';

export default function RadarChart() {
    const { skills } = useAppStore();

    const data = useMemo(() => {
        if (skills.length === 0) {
            return [
                { skill: 'Add skills', mastery: 0, fullMark: 100 },
                { skill: 'to see', mastery: 0, fullMark: 100 },
                { skill: 'your radar', mastery: 0, fullMark: 100 },
            ];
        }
        return skills.slice(0, 8).map((s) => ({
            skill: s.name,
            mastery: s.mastery,
            fullMark: 100,
        }));
    }, [skills]);

    return (
        <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                🎯 Mastery Radar
            </h4>
            <ResponsiveContainer width="100%" height={240}>
                <RechartsRadarChart data={data}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#64748b', fontSize: 10 }}
                        axisLine={false}
                    />
                    <Radar
                        name="Mastery"
                        dataKey="mastery"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.2}
                        strokeWidth={2}
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
                </RechartsRadarChart>
            </ResponsiveContainer>
        </div>
    );
}
