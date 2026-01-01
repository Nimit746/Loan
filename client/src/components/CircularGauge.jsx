import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CircularGauge = ({
    value = 0,
    size = 280,
    strokeWidth = 14,
    label = 'Score',
    description = 'Probability',
    color = 'blue'
}) => {
    const [progress, setProgress] = useState(0);
    const [displayValue, setDisplayValue] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const animationRef = useRef(null);

    useEffect(() => {
        // Delayed start for cinematic effect
        const timer = setTimeout(() => {
            setProgress(value);
        }, 300);
        return () => clearTimeout(timer);
    }, [value]);

    const colors = {
        blue: ['#3b82f6', '#22d3ee'],
        green: ['#10b981', '#34d399'],
        red: ['#ef4444', '#f87171'],
        purple: ['#a855f7', '#c084fc']
    };

    const glowColors = {
        blue: 'rgba(59, 130, 246, 0.5)',
        green: 'rgba(16, 185, 129, 0.5)',
        red: 'rgba(239, 68, 68, 0.5)',
        purple: 'rgba(168, 85, 247, 0.5)'
    };

    const currentColors = colors[color] || colors.blue;
    const currentGlow = glowColors[color] || glowColors.blue;

    return (
        <motion.div
            className="flex-center flex-col relative"
            style={{ width: size, height: size }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
            {/* Background glow pulse */}
            <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: currentGlow }}
                animate={{
                    scale: [0.85, 0.9, 0.85],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* SVG Gauge */}
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Glow Overlay */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`url(#glowGradient-${color})`}
                    strokeWidth={strokeWidth + 10}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                    transition={{ duration: 2.5, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
                    fill="transparent"
                    strokeLinecap="round"
                    className="opacity-25 blur-md"
                />

                {/* Progress Circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`url(#gaugeGradient-${color})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                    transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                    fill="transparent"
                    strokeLinecap="round"
                />

                <defs>
                    <linearGradient id={`gaugeGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={currentColors[0]} />
                        <stop offset="100%" stopColor={currentColors[1]} />
                    </linearGradient>
                    <linearGradient id={`glowGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={currentColors[0]} />
                        <stop offset="100%" stopColor={currentColors[1]} />
                    </linearGradient>
                </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex-center flex-col text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1"
                >
                    {description}
                </motion.span>

                <div className="relative">
                    <motion.span
                        className="text-6xl font-black text-white font-premium"
                        animate={{
                            textShadow: [
                                `0 0 10px ${currentGlow}`,
                                `0 0 20px ${currentGlow}`,
                                `0 0 10px ${currentGlow}`
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <CountUp end={progress} duration={2.2} />
                    </motion.span>
                    <span className="text-2xl font-bold text-slate-500 ml-1">%</span>
                </div>

                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className={`mt-2 text-sm font-bold px-4 py-1 rounded-full bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}
                >
                    {label}
                </motion.span>
            </div>
        </motion.div>
    );
};

// Enhanced CountUp with smoother easing
const CountUp = ({ end, duration }) => {
    const [count, setCount] = useState(0);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = (timestamp - startTimeRef.current) / (duration * 1000);

            if (elapsed < 1) {
                // Custom ease-out-expo for premium feel
                const easeValue = elapsed === 1 ? 1 : 1 - Math.pow(2, -10 * elapsed);
                setCount(Math.floor(easeValue * end));
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [end, duration]);

    return <>{count}</>;
};

export default CircularGauge;
