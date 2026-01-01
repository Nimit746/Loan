import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../GlassCard';
import { FiLayers, FiActivity, FiCpu, FiCheckCircle } from 'react-icons/fi';

const AIFlowSection = () => {
    const steps = [
        {
            icon: FiLayers,
            title: 'Data Collection',
            desc: 'Aggregating multimodal data streams in real-time.',
            color: 'blue'
        },
        {
            icon: FiActivity,
            title: 'Feature Extraction',
            desc: 'Neural mapping of financial & behavioral signals.',
            color: 'cyan'
        },
        {
            icon: FiCpu,
            title: 'Risk Engine',
            desc: 'Deep learning assessment of default probability.',
            color: 'purple'
        },
        {
            icon: FiCheckCircle,
            title: 'Decision',
            desc: 'Final verifiable approval with explainable AI.',
            color: 'indigo'
        }
    ];

    // Color mappings for dynamic styling
    const colorMap = {
        blue: {
            gradient: 'from-blue-500 to-blue-600',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            glow: 'rgba(59, 130, 246, 0.4)',
            bg: 'bg-blue-500/10'
        },
        cyan: {
            gradient: 'from-cyan-500 to-cyan-600',
            text: 'text-cyan-400',
            border: 'border-cyan-500/30',
            glow: 'rgba(34, 211, 238, 0.4)',
            bg: 'bg-cyan-500/10'
        },
        purple: {
            gradient: 'from-purple-500 to-purple-600',
            text: 'text-purple-400',
            border: 'border-purple-500/30',
            glow: 'rgba(139, 92, 246, 0.4)',
            bg: 'bg-purple-500/10'
        },
        indigo: {
            gradient: 'from-indigo-500 to-indigo-600',
            text: 'text-indigo-400',
            border: 'border-indigo-500/30',
            glow: 'rgba(99, 102, 241, 0.4)',
            bg: 'bg-indigo-500/10'
        }
    };

    return (
        <section className="section-padding bg-[#050a1f]/30 relative overflow-hidden">
            {/* Ambient background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-purple-500/5 rounded-full blur-[80px]"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.07, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                />
            </div>

            <div className="main-container relative z-10">
                {/* Section Header */}
                <div className="content-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <span className="text-purple-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                            Neural Pipeline
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 }}
                    >
                        System <span className="gradient-text italic">Orchestration</span>
                    </motion.h2>

                    <motion.p
                        className="text-slate-400 text-lg max-w-2xl font-light"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Follow the journey of a loan application through our high-frequency AI architecture.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connection Line - Base */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent hidden lg:block -translate-y-1/2" />

                    {/* Animated Flow Gradient - Cinematic pulse */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-[3px] w-full hidden lg:block -translate-y-1/2 overflow-hidden"
                    >
                        <motion.div
                            className="h-full w-[200%]"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, transparent 20%, #3b82f6 40%, #22d3ee 50%, #3b82f6 60%, transparent 80%, transparent 100%)',
                            }}
                            animate={{ x: ['-50%', '0%'] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        />
                    </motion.div>

                    {/* Secondary flow line for depth */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-[1px] w-full hidden lg:block -translate-y-1/2 blur-[1px] opacity-50"
                    >
                        <motion.div
                            className="h-full w-[200%]"
                            style={{
                                background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                            }}
                            animate={{ x: ['-50%', '0%'] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: 1.5
                            }}
                        />
                    </motion.div>

                    {/* Step Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    delay: i * 0.15,
                                    duration: 0.9,
                                    ease: [0.25, 1, 0.5, 1]
                                }}
                                className="content-center"
                            >
                                {/* Node with pulsing glow and scale oscillation */}
                                <motion.div
                                    className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 glass-morphism ${colorMap[step.color].border}`}
                                    animate={{
                                        scale: [1, 1.03, 1],
                                        boxShadow: [
                                            `0 0 0px ${colorMap[step.color].glow}`,
                                            `0 0 35px ${colorMap[step.color].glow}`,
                                            `0 0 0px ${colorMap[step.color].glow}`
                                        ]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        delay: i * 0.8,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <step.icon className={`w-10 h-10 ${colorMap[step.color].text}`} />
                                </motion.div>

                                <motion.h3
                                    className="text-2xl font-bold text-white mb-3 font-premium"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {step.title}
                                </motion.h3>

                                <p className="text-slate-400 text-sm max-w-[200px] leading-relaxed font-light">
                                    {step.desc}
                                </p>

                                {/* Step number indicator */}
                                <motion.div
                                    className={`mt-4 text-xs font-bold ${colorMap[step.color].text} opacity-50`}
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                >
                                    0{i + 1}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Connecting dots between nodes */}
                    <div className="absolute top-1/2 left-0 w-full hidden lg:flex justify-around -translate-y-1/2 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                style={{ marginLeft: i === 0 ? '22%' : '0' }}
                                animate={{
                                    scale: [0.8, 1.2, 0.8],
                                    opacity: [0.3, 0.8, 0.3]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.4
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIFlowSection;
