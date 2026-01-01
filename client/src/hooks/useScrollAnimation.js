import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for early/late triggering
 * @param {boolean} options.triggerOnce - Only trigger animation once
 */
export const useScrollAnimation = ({
    threshold = 0.1,
    rootMargin = '-50px',
    triggerOnce = true
} = {}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        setHasAnimated(true);
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible, hasAnimated };
};

/**
 * Scroll animation variants for Framer Motion
 * Provides consistent, cinematic animations across components
 */
export const scrollAnimationVariants = {
    fadeUp: {
        hidden: {
            opacity: 0,
            y: 40,
            filter: 'blur(6px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1]
            }
        }
    },
    fadeIn: {
        hidden: { opacity: 0, filter: 'blur(6px)' },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            transition: { duration: 1, ease: [0.25, 1, 0.5, 1] }
        }
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
        }
    },
    slideLeft: {
        hidden: { opacity: 0, x: 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }
    },
    slideRight: {
        hidden: { opacity: 0, x: -40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
        }
    }
};

/**
 * Stagger container variants for child animations
 */
export const staggerContainer = (staggerDelay = 0.1, delayChildren = 0.2) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayChildren
        }
    }
});

export default useScrollAnimation;
