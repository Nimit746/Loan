import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../GlassCard';
import { FiLock, FiShield, FiTrendingUp, FiTarget } from 'react-icons/fi';

const TrustSection = () => {
    const features = [
        {
            icon: FiLock,
            title: 'End-to-End Encryption',
            desc: 'Bank-grade security protocols for all sensitive financial data points.',
            color: 'blue'
        },
        {
            icon: FiShield,
            title: 'Bias-Aware AI',
            desc: 'Regularly audited algorithms to ensure parity across all demographics.',
            color: 'cyan'
        },
        {
            icon: FiTrendingUp,
            title: 'Explainable ML',
            desc: 'Every decision provides a verifiable technical rationale for transparency.',
            color: 'indigo'
        },
        {
            icon: FiTarget,
            title: 'High-Precision Metrics',
            desc: '99.8% precision rate on historical data validation sets.',
            color: 'purple'
        }
    ];

    // Color mappings
    const colorMap = {
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
        cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
        indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
        purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' }
    };

    return (
        <section className="section-padding relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-[10%] left-[50%] w-[60%] h-[60%] bg-blue-500/3 rounded-full blur-[150px]"
                    animate={{
                        x: [0, -30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
            </div>

            <div className="main-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left Side - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <motion.span
                            className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-6 block"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Security & Integrity
                        </motion.span>

                        <motion.h2
                            className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] font-premium"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Trust Built on <br />
                            <span className="gradient-text">Verifiable Logic</span>
                        </motion.h2>

                        <motion.p
                            className="text-slate-400 text-lg mb-12 font-light leading-relaxed max-w-xl"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            We believe that AI decisions should never be a "black box".
                            Our platform is built on principles of radical transparency and mathematical certainty.
                        </motion.p>

                        {/* Compliance Badges */}
                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            {['GDPR COMPLIANT', 'SOC2 TYPE II', 'ISO 27001'].map((label, i) => (
                                <ComplianceBadge key={label} label={label} delay={i * 0.1} />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <GlassCard
                                key={i}
                                className="p-6"
                                hover={true}
                                glowColor={feature.color}
                                delay={i}
                            >
                                {/* Icon with glow pulse */}
                                <motion.div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorMap[feature.color].bg} ${colorMap[feature.color].border} border`}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                                >
                                    <feature.icon className={`w-6 h-6 ${colorMap[feature.color].text}`} />
                                </motion.div>

                                <h4 className="text-lg font-bold text-white mb-3 font-premium">
                                    {feature.title}
                                </h4>
                                <p className="text-slate-400 text-sm font-light leading-relaxed">
                                    {feature.desc}
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative line */}
            <motion.div
                className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -rotate-6 pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
            />
        </section>
    );
};

// Compliance Badge with animation
const ComplianceBadge = ({ label, delay = 0 }) => (
    <motion.div
        className="flex items-center gap-2 px-4 py-2 rounded-lg glass-morphism border border-white/5"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + delay }}
        whileHover={{
            scale: 1.02,
            borderColor: 'rgba(34, 211, 238, 0.3)',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)'
        }}
    >
        <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[10px] font-black text-white/50 tracking-[0.2em]">{label}</span>
    </motion.div>
);

export default TrustSection;
