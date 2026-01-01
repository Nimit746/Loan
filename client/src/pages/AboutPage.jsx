import React from 'react';
import { motion } from 'framer-motion';
import TrustSection from '../components/sections/TrustSection';
import GlassCard from '../components/GlassCard';
import { FiUsers, FiTarget, FiShield } from 'react-icons/fi';

const AboutPage = () => {
    const stats = [
        { icon: FiUsers, title: 'Inclusion', value: '1.2M+', desc: 'Borrowers empowered worldwide' },
        { icon: FiTarget, title: 'Accuracy', value: '99.98%', desc: 'Real-time prediction precision' },
        { icon: FiShield, title: 'Integrity', value: 'Decentralized', desc: 'Immutable decision records' },
    ];

    return (
        <div className="relative pb-20 min-h-screen">
            {/* Ambient glow effects */}
            <div className="absolute top-40 left-0 w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-40 right-0 w-[25%] h-[25%] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="main-container relative z-10">
                <div className="content-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <span className="text-indigo-400 text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
                            Our Mission
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 font-premium">
                            Ethical <span className="gradient-text italic">Intelligence</span>
                        </h1>
                        <p className="text-slate-400 text-xl max-w-3xl font-light leading-relaxed">
                            LoanAI was founded to solve the inherent biases in traditional lending.
                            By using multimodal data, we see the person, not just the score.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-24">
                    {stats.map((stat, i) => (
                        <GlassCard key={i} delay={i} className="text-center p-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                                <stat.icon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{stat.title}</h3>
                            <div className="text-4xl font-black text-white mb-2 font-premium">{stat.value}</div>
                            <p className="text-slate-400 text-sm font-light">{stat.desc}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <TrustSection />
        </div>
    );
};

export default AboutPage;
