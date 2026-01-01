import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AnimatedButton from '../AnimatedButton';
import HeroCubeAnimation from '../HeroCubeAnimation';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(numericValue * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [isInView, numericValue, duration]);

    // Format output
    const displayValue = value.includes('.')
        ? count.toFixed(1)
        : Math.round(count);

    return (
        <span ref={ref} className="tabular-nums">
            {value.startsWith('<') && '<'}
            {displayValue}
            {suffix}
        </span>
    );
};

const HeroSection = ({ onStartPrediction, onHowItWorks }) => {
    // Letter-by-letter animation for headline
    const headlineText = "Multimodal";
    const subHeadlineText = "Intelligence";

    const letterVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            rotateX: -90,
            filter: 'blur(4px)'
        },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            transition: {
                delay: 0.8 + i * 0.04, // Start at 0.8s delay
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    };

    const textRevealVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 1,
                delay: 1.2, // After headline
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 1.5
            }
        }
    };

    const statVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background gradient overlays with animation */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.1, 0.12, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <motion.div
                    className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px]"
                    animate={{
                        x: [-50, 50, -50],
                        opacity: [0.05, 0.08, 0.05]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="main-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    {/* Left side - Text content */}
                    <motion.div
                        className="order-2 lg:order-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Badge with breathing animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-6"
                        >
                            <motion.span
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism border border-white/10 text-xs font-bold text-cyan-400 uppercase tracking-widest"
                                animate={{
                                    borderColor: ['rgba(255,255,255,0.1)', 'rgba(34,211,238,0.3)', 'rgba(255,255,255,0.1)']
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <motion.span
                                    className="w-2 h-2 bg-cyan-400 rounded-full"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [1, 0.6, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                AI-Powered Risk Engine
                            </motion.span>
                        </motion.div>

                        {/* Headline with letter animation */}
                        <div className="mb-6">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] font-premium">
                                <div className="overflow-hidden">
                                    {headlineText.split('').map((letter, i) => (
                                        <motion.span
                                            key={i}
                                            custom={i}
                                            variants={letterVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="inline-block"
                                            style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </div>
                                <div className="overflow-hidden">
                                    {subHeadlineText.split('').map((letter, i) => (
                                        <motion.span
                                            key={i}
                                            custom={i + headlineText.length}
                                            variants={letterVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="inline-block gradient-text-animated italic"
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                </div>
                            </h1>
                        </div>

                        {/* Subheading */}
                        <motion.p
                            variants={textRevealVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-slate-400 text-base md:text-lg max-w-lg leading-relaxed font-light mb-10"
                        >
                            The world's first multimodal deep learning engine for autonomous loan decisions.
                            Analyze documents, images, and structured data simultaneously.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(59, 130, 246, 0.3)',
                                        '0 0 50px rgba(59, 130, 246, 0.5)',
                                        '0 0 20px rgba(59, 130, 246, 0.3)',
                                    ],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="rounded-xl"
                            >
                                <AnimatedButton
                                    variant="primary"
                                    size="lg"
                                    onClick={onStartPrediction}
                                    icon={<FiArrowRight />}
                                    iconPosition="right"
                                >
                                    Start Prediction
                                </AnimatedButton>
                            </motion.div>

                            <AnimatedButton
                                variant="secondary"
                                size="lg"
                                onClick={onHowItWorks}
                                icon={<FiPlay className="w-4 h-4" />}
                                iconPosition="left"
                            >
                                How It Works
                            </AnimatedButton>
                        </motion.div>

                        {/* Stats with animated counters */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="mt-12 pt-8 border-t border-white/5"
                        >
                            <div className="flex gap-10">
                                <motion.div variants={statVariants}>
                                    <motion.div
                                        className="text-2xl font-black text-white"
                                        whileHover={{ scale: 1.05, color: '#22d3ee' }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <AnimatedCounter value="99.8" suffix="%" duration={1.5} />
                                    </motion.div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Accuracy</div>
                                </motion.div>
                                <motion.div variants={statVariants}>
                                    <motion.div
                                        className="text-2xl font-black text-white"
                                        whileHover={{ scale: 1.05, color: '#22d3ee' }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <AnimatedCounter value="50" suffix="ms" duration={1.5} />
                                    </motion.div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Latency</div>
                                </motion.div>
                                <motion.div variants={statVariants}>
                                    <motion.div
                                        className="text-2xl font-black text-white"
                                        whileHover={{ scale: 1.05, color: '#22d3ee' }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <AnimatedCounter value="3" duration={1} />
                                    </motion.div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">AI Models</div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right side - 3D Cube Animation */}
                    <motion.div
                        className="order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 1.5,
                            delay: 0.3,
                            ease: [0.34, 1.56, 0.64, 1] // Elastic easing
                        }}
                    >
                        <HeroCubeAnimation className="w-full h-full" />
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator with enhanced animation */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1"
                >
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Scroll</span>
                    <motion.div
                        className="w-[1px] h-8 bg-gradient-to-b from-cyan-500/50 to-transparent"
                        animate={{
                            opacity: [0.5, 1, 0.5],
                            height: ['24px', '32px', '24px']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
