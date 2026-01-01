import React from 'react';
import { motion } from 'framer-motion';
import PredictionDashboard from '../components/sections/PredictionDashboard';

const PredictPage = () => {
    return (
        <div className="min-h-screen relative">
            {/* Page Header - With proper spacing from navbar */}
            <div className="main-container mb-12 flex flex-col items-center">
                <motion.div
                    className="text-center max-w-3xl px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                >
                    <span className="text-blue-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
                        Verification Sandbox
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-premium leading-tight">
                        Neural <span className="gradient-text-animated italic">Predictor</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                        Enter your financial parameters and upload supporting documents.
                        Our multimodal engine will perform a comprehensive <span className="text-blue-400 font-medium">real-time risk analysis</span>.
                    </p>
                </motion.div>
            </div>

            {/* Dashboard */}
            <div className="main-container pb-20">
                <PredictionDashboard />
            </div>

            {/* Ambient glow effects */}
            <div className="absolute top-40 right-0 w-[25%] h-[25%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-[20%] h-[20%] bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
        </div>
    );
};

export default PredictPage;
