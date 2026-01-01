import React from 'react';
import { motion } from 'framer-motion';
import AIFlowSection from '../components/sections/AIFlowSection';
import MultimodalInputSection from '../components/sections/MultimodalInputSection';

const HowItWorksPage = () => {
    return (
        <div className="relative pb-20 min-h-screen">
            {/* Ambient glow effects */}
            <div className="absolute top-40 right-0 w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-40 left-0 w-[25%] h-[25%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="main-container relative z-10">
                <div className="content-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <span className="text-purple-400 text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
                            Technical Overview
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 font-premium">
                            The <span className="gradient-text italic">Protocol</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl font-light leading-relaxed">
                            Understanding the fusion of disparate data streams through our
                            proprietary multimodal architecture.
                        </p>
                    </motion.div>
                </div>
            </div>

            <AIFlowSection />
            <MultimodalInputSection />
        </div>
    );
};

export default HowItWorksPage;
