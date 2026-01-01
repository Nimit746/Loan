import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedButton = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    onClick,
    className = '',
    type = 'button',
    ...props
}) => {
    const [ripples, setRipples] = useState([]);
    const buttonRef = useRef(null);

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const baseClasses = `
        relative inline-flex items-center justify-center gap-2
        font-semibold rounded-xl overflow-hidden
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
    `;

    const variantClasses = {
        primary: `
            bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600
            text-white
            shadow-[0_4px_15px_rgba(59,130,246,0.4),0_0_30px_rgba(59,130,246,0.2)]
        `,
        secondary: `
            bg-transparent
            text-white
            border border-white/20
        `,
        ghost: `
            bg-transparent
            text-cyan-400
        `,
    };

    // Handle ripple effect on click
    const handleClick = (e) => {
        if (disabled || loading) return;

        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const newRipple = {
            id: Date.now(),
            x,
            y,
            size
        };

        setRipples(prev => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);

        // Call original onClick
        if (onClick) onClick(e);
    };

    return (
        <motion.button
            ref={buttonRef}
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={handleClick}
            disabled={disabled || loading}
            whileHover={disabled ? {} : {
                scale: 1.03,
                y: -2,
                boxShadow: variant === 'primary'
                    ? '0 8px 30px rgba(59,130,246,0.5), 0 0 50px rgba(59,130,246,0.3)'
                    : undefined,
                transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
            }}
            whileTap={disabled ? {} : {
                scale: 0.95,
                transition: { duration: 0.1 }
            }}
            {...props}
        >
            {/* Ripple effects */}
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.span
                        key={ripple.id}
                        className="absolute bg-white/30 rounded-full pointer-events-none"
                        style={{
                            left: ripple.x - ripple.size / 2,
                            top: ripple.y - ripple.size / 2,
                            width: ripple.size,
                            height: ripple.size,
                        }}
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                ))}
            </AnimatePresence>

            {/* Shimmer effect for primary - moves every 4s */}
            {variant === 'primary' && (
                <motion.span
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 1 }}
                >
                    <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            repeatDelay: 4
                        }}
                    />
                </motion.span>
            )}

            {/* Pulsing glow for primary */}
            {variant === 'primary' && (
                <motion.span
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                        boxShadow: [
                            '0 0 20px rgba(59,130,246,0.3)',
                            '0 0 40px rgba(59,130,246,0.5)',
                            '0 0 20px rgba(59,130,246,0.3)',
                        ]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            )}

            {/* Secondary button hover effects */}
            {variant === 'secondary' && (
                <>
                    <motion.span
                        className="absolute inset-0 bg-white/0"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        className="absolute inset-0 rounded-xl border border-transparent"
                        whileHover={{
                            borderColor: 'rgba(34, 211, 238, 0.5)',
                            boxShadow: '0 0 30px rgba(6, 182, 212, 0.25)'
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </>
            )}

            {/* Ghost button hover effect */}
            {variant === 'ghost' && (
                <motion.span
                    className="absolute inset-0 bg-cyan-400/0 rounded-xl"
                    whileHover={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Loading spinner */}
            {loading ? (
                <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </motion.svg>
                    <span>Processing...</span>
                </motion.div>
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <motion.span
                            className="relative z-10"
                            whileHover={{ x: -3, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {icon}
                        </motion.span>
                    )}
                    <span className="relative z-10">{children}</span>
                    {icon && iconPosition === 'right' && (
                        <motion.span
                            className="relative z-10"
                            whileHover={{ x: 5, scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {icon}
                        </motion.span>
                    )}
                </>
            )}
        </motion.button>
    );
};

export default AnimatedButton;
