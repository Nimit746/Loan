import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../GlassCard';
import { FiFileText, FiImage, FiType, FiDatabase, FiMic } from 'react-icons/fi';

const MultimodalInputSection = () => {
    const inputs = [
        {
            icon: FiFileText,
            title: 'Document Analysis',
            desc: 'Extract creditworthiness from PDFs, bank statements, and tax returns.',
            color: 'blue'
        },
        {
            icon: FiImage,
            title: 'Visual Verification',
            desc: 'AI-powered identity and asset verification through image processing.',
            color: 'cyan'
        },
        {
            icon: FiType,
            title: 'Contextual Text',
            desc: 'Natural Language Processing of employment history and bios.',
            color: 'indigo'
        },
        {
            icon: FiDatabase,
            title: 'Structured Data',
            desc: 'Seamless integration with traditional credit scores and financial APIs.',
            color: 'purple'
        },
        {
            icon: FiMic,
            title: 'Voice Biometrics',
            desc: 'Advanced fraud detection through unique vocal pattern analysis.',
            color: 'blue'
        }
    ];

    // Color mappings
    const colorMap = {
        blue: { gradient: 'from-blue-500/20', border: 'border-blue-500/20', text: 'text-blue-400', bg: 'bg-blue-500/10' },
        cyan: { gradient: 'from-cyan-500/20', border: 'border-cyan-500/20', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        indigo: { gradient: 'from-indigo-500/20', border: 'border-indigo-500/20', text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        purple: { gradient: 'from-purple-500/20', border: 'border-purple-500/20', text: 'text-purple-400', bg: 'bg-purple-500/10' }
    };

    return (
        <section className="section-padding relative overflow-hidden">
            {/* Ambient backgrounds */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute top-[30%] right-[5%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.03, 0.06, 0.03]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[20%] left-[5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.03, 0.05, 0.03]
                    }}
                    transition={{ duration: 12, repeat: Infinity, delay: 3 }}
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
                        <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 block">
                            Versatile Fusion
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance max-w-4xl"
                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 }}
                    >
                        Multimodal Intelligence <br />
                        <span className="opacity-40">for 360° Risk Profiling</span>
                    </motion.h2>

                    <motion.p
                        className="text-slate-400 text-lg max-w-2xl font-light"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Our engine processes heterogeneous data streams simultaneously,
                        eliminating informational silos in the loan approval process.
                    </motion.p>
                </div>

                {/* Input Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {inputs.map((input, i) => (
                        <GlassCard
                            key={i}
                            hover={true}
                            glow={false}
                            glowColor={input.color}
                            delay={i}
                            className="flex-1"
                        >
                            {/* Icon container with pulse */}
                            <motion.div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${colorMap[input.color].bg} ${colorMap[input.color].border} border`}
                                animate={{
                                    boxShadow: [
                                        '0 0 0px transparent',
                                        `0 0 20px ${input.color === 'blue' ? 'rgba(59, 130, 246, 0.3)' : input.color === 'cyan' ? 'rgba(34, 211, 238, 0.3)' : input.color === 'indigo' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                                        '0 0 0px transparent'
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                            >
                                <input.icon className={`w-6 h-6 ${colorMap[input.color].text}`} />
                            </motion.div>

                            <h3 className="text-xl font-bold text-white mb-4">{input.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-light mb-6">
                                {input.desc}
                            </p>

                            {/* Active indicator */}
                            <div className="mt-auto flex items-center gap-2 text-xs font-bold text-cyan-400/60 uppercase tracking-widest">
                                <span>Active</span>
                                <motion.span
                                    className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [1, 0.6, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MultimodalInputSection;
