import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useScrollProgress } from '../hooks/useMouseInteraction';

/**
 * Scroll Progress Indicator component
 * Shows a vertical progress bar on the left side of the screen
 * with a glowing dot at the current position
 */
const ScrollProgress = () => {
    const progress = useScrollProgress();

    // Use spring animation for smooth progress
    const scaleY = useSpring(progress / 100, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
        >
            {/* Progress percentage */}
            <motion.span
                className="text-[10px] font-bold text-slate-500 tracking-widest"
                animate={{ opacity: progress > 5 ? 1 : 0.3 }}
            >
                {Math.round(progress)}%
            </motion.span>

            {/* Progress bar container */}
            <div className="relative w-[2px] h-32 bg-white/10 rounded-full overflow-hidden">
                {/* Progress fill */}
                <motion.div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 rounded-full origin-top"
                    style={{
                        height: '100%',
                        scaleY,
                        transformOrigin: 'top'
                    }}
                />

                {/* Glowing dot at current position */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400"
                    style={{
                        top: `${progress}%`,
                        translateY: '-50%'
                    }}
                    animate={{
                        scale: [1, 1.4, 1],
                        boxShadow: [
                            '0 0 10px rgba(34, 211, 238, 0.5)',
                            '0 0 20px rgba(34, 211, 238, 0.8)',
                            '0 0 10px rgba(34, 211, 238, 0.5)',
                        ]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            </div>

            {/* Scroll text */}
            <motion.span
                className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] writing-mode-vertical"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                animate={{
                    opacity: progress < 95 ? 0.5 : 0.2,
                    y: progress < 95 ? [0, 3, 0] : 0
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Scroll
            </motion.span>
        </motion.div>
    );
};

export default ScrollProgress;
