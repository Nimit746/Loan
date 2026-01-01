import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
    children,
    className = '',
    hover = true,
    glow = false,
    glowColor = 'blue',
    useRotatingBorder = false,
    onClick,
    delay = 0,
    animate = true,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Idle floating animation
    const idleFloat = {
        y: [0, -6, 0],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: [0.65, 0, 0.35, 1],
            delay: delay * 0.3
        }
    };

    // Hover animation with tilt and shadow expansion
    const hoverAnimation = hover ? {
        y: -12,
        rotateX: 4,
        rotateY: 4,
        scale: 1.02,
        transition: {
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1]
        }
    } : {};

    // Glow color variants
    const glowColors = {
        blue: 'rgba(59, 130, 246, 0.4)',
        cyan: 'rgba(34, 211, 238, 0.4)',
        purple: 'rgba(139, 92, 246, 0.4)',
        indigo: 'rgba(99, 102, 241, 0.4)'
    };

    return (
        <motion.div
            className={`
                relative h-full
                ${useRotatingBorder ? 'rotating-border' : 'glass-card glass-morphism'}
                ${glow ? `glow-${glowColor}` : ''}
                ${className}
            `}
            initial={animate ? { opacity: 0, y: 20 } : {}}
            whileInView={animate ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
                duration: 0.5,
                delay: delay * 0.1,
                ease: [0.25, 1, 0.5, 1]
            }}
            whileHover={hoverAnimation}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            style={{
                perspective: 1000,
                transformStyle: 'preserve-3d'
            }}
            onClick={onClick}
            {...props}
        >
            {/* Content wrapper */}
            <div className={`p-8 h-full flex flex-col ${useRotatingBorder ? 'relative z-10' : ''}`}>
                {children}
            </div>

            {/* Animated border glow on hover */}
            {hover && !useRotatingBorder && (
                <motion.div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        boxShadow: isHovered
                            ? `0 0 40px ${glowColors[glowColor] || glowColors.blue}, inset 0 0 20px ${glowColors[glowColor] || glowColors.blue}`
                            : '0 0 0px transparent'
                    }}
                    transition={{ duration: 0.4 }}
                />
            )}

            {/* Clockwise border animation on hover */}
            {hover && !useRotatingBorder && (
                <motion.div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="absolute inset-[-2px]"
                        style={{
                            background: `conic-gradient(from 0deg, transparent, ${glowColors[glowColor] || glowColors.blue}, transparent)`,
                            borderRadius: 'inherit'
                        }}
                        animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                    <div
                        className="absolute inset-[1px] bg-[#050a1f] rounded-[inherit]"
                        style={{ borderRadius: 'calc(1.5rem - 1px)' }}
                    />
                </motion.div>
            )}

            {/* Idle float overlay - applies continuous floating */}
            {animate && hover && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={!isHovered ? idleFloat : {}}
                />
            )}

            {/* Shine effect on hover */}
            {hover && (
                <motion.div
                    className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)'
                        }}
                        initial={{ x: '-100%' }}
                        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                </motion.div>
            )}
        </motion.div>
    );
};

export default GlassCard;
