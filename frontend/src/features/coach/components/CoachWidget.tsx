'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/shared/lib/store';

export default function CoachWidget() {
    const { coachMessages, addCoachMessage, skills, user } = useAppStore();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        addCoachMessage({ role: 'user', content: userMsg });
        setInput('');
        setIsLoading(true);

        try {
            // Include the newly added message in the payload
            const payloadMessages = [...coachMessages, { role: 'user', content: userMsg }];

            const response = await fetch('/api/coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: payloadMessages,
                    userProfile: user,
                    skills: skills,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch coach response');
            }

            const data = await response.json();
            addCoachMessage({ role: 'coach', content: data.reply });

        } catch (error: any) {
            console.error('Coach Chat Error:', error);
            addCoachMessage({
                role: 'coach',
                content: `⚠️ System Error: ${error.message}. Please verify your GEMINI_API_KEY environment variable is set correctly.`
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-dark)] rounded-xl border border-[rgba(139,92,246,0.2)] holo-border purple-flame-border">
            <div className="px-4 py-3 rounded-t-xl border-b flex justify-between items-center bg-[#0d131f] border-[rgba(139,92,246,0.2)]">
                <h4 className="text-[11px] font-bold tracking-widest text-[#8b5cf6] font-mono uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse"></span>
                    AI System Interface
                </h4>
                <div className="flex gap-1.5 opacity-60">
                    <div className="w-3 h-1 bg-[#8b5cf6]"></div>
                    <div className="w-5 h-1 bg-cyan-400"></div>
                </div>
            </div>

            {/* Messages */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4 relative"
                style={{ maxHeight: '350px', minHeight: '200px' }}
            >
                {/* Horizontal scanline background effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, white 3px, white 3px)',
                    backgroundSize: '100% 4px'
                }}></div>

                {coachMessages.length === 0 && (
                    <div className="text-center py-8 relative z-10">
                        <div className="text-4xl mb-4 text-[#8b5cf6] opacity-50 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">
                            ♊
                        </div>
                        <p className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-widest mb-4">
                            System Idle. Awaiting Query...
                        </p>
                        <div className="flex flex-col gap-2 max-w-[80%] mx-auto">
                            {['Diagnose my current skill gaps.', 'Analyze market trends.', 'Generate a target quest.'].map((q) => (
                                <button
                                    key={q}
                                    onClick={() => { setInput(q); }}
                                    className="px-3 py-2 rounded text-[11px] transition-all font-mono uppercase text-left hover:pl-4"
                                    style={{
                                        background: 'rgba(139, 92, 246, 0.05)',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid rgba(139, 92, 246, 0.2)',
                                        borderLeft: '2px solid #8b5cf6'
                                    }}
                                >
                                    &gt; {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {coachMessages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex w-full relative z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'coach' && (
                            <div className="flex flex-col max-w-[90%]">
                                <span className="text-[10px] font-bold tracking-widest text-[#8b5cf6] font-mono mb-1 uppercase">
                                    SYSTEM RESPONSE
                                </span>
                                <div className="text-sm font-light leading-relaxed text-[#e2e8f0] border-l-2 border-[#8b5cf6] pl-3 py-1 bg-gradient-to-r from-[rgba(139,92,246,0.05)] to-transparent">
                                    <p className="whitespace-pre-line">{msg.content}</p>
                                </div>
                            </div>
                        )}
                        {msg.role === 'user' && (
                            <div className="flex flex-col items-end max-w-[85%]">
                                <span className="text-[10px] font-bold tracking-widest text-cyan-400 font-mono mb-1 uppercase">
                                    PLAYER QUERY
                                </span>
                                <div className="text-sm px-4 py-2 bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.2)] rounded text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                    {msg.content}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 rounded-b-xl bg-[#0d131f] border-t border-[rgba(139,92,246,0.2)] relative">
                {isLoading && (
                    <div className="absolute -top-4 left-4 text-[10px] font-mono text-[#8b5cf6] uppercase tracking-widest animate-pulse">
                        Processing System Directive...
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                        placeholder={isLoading ? "SYSTEM PROCESSING..." : "ASK THE SYSTEM..."}
                        className="flex-1 px-4 py-2.5 bg-[var(--bg-card)] border border-[rgba(139,92,246,0.3)] text-sm focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_15px_rgba(139,92,246,0.2)] disabled:opacity-50 text-white font-mono placeholder:text-gray-600 transition-all rounded-sm"
                        id="coach-input"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="px-4 py-2.5 font-bold transition-all disabled:opacity-50 bg-[rgba(139,92,246,0.15)] border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white shadow-[0_0_10px_rgba(139,92,246,0.2)] rounded-sm flex items-center justify-center"
                        aria-label="Send message"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    </button>
                </div>
            </div>
        </div >
    );
}
