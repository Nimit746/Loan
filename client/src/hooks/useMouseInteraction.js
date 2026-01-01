import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for mouse interaction effects including:
 * - Tilt effect for 3D elements (tracks mouse and tilts toward cursor)
 * - Repulsion/attraction physics for floating elements
 * - Smooth transitions with easing
 */

// Throttle function to limit update frequency
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Hook for 3D tilt effect following mouse cursor
 * @param {Object} options - Configuration
 * @param {number} options.maxTilt - Maximum tilt angle in degrees (default: 15)
 * @param {number} options.perspective - CSS perspective value (default: 1000)
 * @param {number} options.transitionSpeed - Transition duration in seconds (default: 0.1)
 * @param {boolean} options.reset - Reset on mouse leave (default: true)
 */
export const useMouseTilt = ({
    maxTilt = 15,
    perspective = 1000,
    transitionSpeed = 0.1,
    reset = true
} = {}) => {
    const ref = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback(
        throttle((e) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate tilt based on mouse distance from center
            const percentX = (e.clientX - centerX) / (rect.width / 2);
            const percentY = (e.clientY - centerY) / (rect.height / 2);

            // Clamp values between -1 and 1
            const clampedX = Math.max(-1, Math.min(1, percentX));
            const clampedY = Math.max(-1, Math.min(1, percentY));

            setTilt({
                x: clampedY * maxTilt * -1, // Invert for natural tilt
                y: clampedX * maxTilt
            });
        }, 16), // ~60fps
        [maxTilt]
    );

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        if (reset) {
            setTilt({ x: 0, y: 0 });
        }
    };

    const tiltStyle = {
        transform: `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: `transform ${transitionSpeed}s ease-out`,
        transformStyle: 'preserve-3d'
    };

    return {
        ref,
        tilt,
        tiltStyle,
        isHovered,
        handlers: {
            onMouseMove: handleMouseMove,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave
        }
    };
};

/**
 * Hook for global mouse position tracking with smooth interpolation
 * Useful for parallax and repulsion effects
 */
export const useMousePosition = ({ smoothing = 0.1 } = {}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
    const frameRef = useRef();

    useEffect(() => {
        const handleMouseMove = throttle((e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        }, 16);

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Smooth interpolation using requestAnimationFrame
    useEffect(() => {
        const animate = () => {
            setSmoothPosition(prev => ({
                x: prev.x + (position.x - prev.x) * smoothing,
                y: prev.y + (position.y - prev.y) * smoothing
            }));
            frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [position, smoothing]);

    // Normalized position (-1 to 1 relative to viewport center)
    const normalized = {
        x: (smoothPosition.x / window.innerWidth - 0.5) * 2,
        y: (smoothPosition.y / window.innerHeight - 0.5) * 2
    };

    return { position, smoothPosition, normalized };
};

/**
 * Hook for repulsion/attraction physics effect
 * Elements push away or attract to mouse cursor
 */
export const useRepulsion = ({
    radius = 150,
    strength = 50,
    mode = 'repel', // 'repel' or 'attract'
    friction = 0.9,
    enabled = true
} = {}) => {
    const elementRef = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef();

    useEffect(() => {
        if (!enabled) return;

        const handleMouseMove = throttle((e) => {
            if (!elementRef.current) return;

            const rect = elementRef.current.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;

            const dx = elementCenterX - e.clientX;
            const dy = elementCenterY - e.clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                const force = (radius - distance) / radius;
                const angle = Math.atan2(dy, dx);
                const multiplier = mode === 'repel' ? 1 : -1;

                velocityRef.current.x += Math.cos(angle) * force * strength * multiplier * 0.1;
                velocityRef.current.y += Math.sin(angle) * force * strength * multiplier * 0.1;
            }
        }, 16);

        const animate = () => {
            velocityRef.current.x *= friction;
            velocityRef.current.y *= friction;

            setOffset(prev => ({
                x: prev.x + velocityRef.current.x,
                y: prev.y + velocityRef.current.y
            }));

            // Spring back to origin
            velocityRef.current.x -= offset.x * 0.05;
            velocityRef.current.y -= offset.y * 0.05;

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, [radius, strength, mode, friction, enabled, offset.x, offset.y]);

    const repulsionStyle = {
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.05s linear'
    };

    return { ref: elementRef, offset, repulsionStyle };
};

/**
 * Hook for scroll-based progress tracking
 */
export const useScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = throttle(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(Math.min(100, Math.max(0, scrollPercent)));
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return progress;
};

export default useMouseTilt;
