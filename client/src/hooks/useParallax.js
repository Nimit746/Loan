import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for parallax effects on scroll and mouse movement
 * @param {Object} options - Configuration options
 * @param {number} options.scrollSpeed - Scroll parallax multiplier (0.1 = slow, 1 = normal)
 * @param {number} options.mouseSpeed - Mouse parallax multiplier
 * @param {boolean} options.enableMouse - Enable mouse parallax
 * @param {boolean} options.enableScroll - Enable scroll parallax
 */
export const useParallax = ({
    scrollSpeed = 0.5,
    mouseSpeed = 0.02,
    enableMouse = true,
    enableScroll = true
} = {}) => {
    const ref = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0, scrollY: 0 });

    // Handle mouse movement
    const handleMouseMove = useCallback((e) => {
        if (!enableMouse) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const x = (e.clientX - centerX) * mouseSpeed;
        const y = (e.clientY - centerY) * mouseSpeed;

        setOffset(prev => ({ ...prev, x, y }));
    }, [mouseSpeed, enableMouse]);

    // Handle scroll
    const handleScroll = useCallback(() => {
        if (!enableScroll) return;

        const scrollY = window.scrollY * scrollSpeed;
        setOffset(prev => ({ ...prev, scrollY }));
    }, [scrollSpeed, enableScroll]);

    useEffect(() => {
        if (enableMouse) {
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        }
        if (enableScroll) {
            window.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleMouseMove, handleScroll, enableMouse, enableScroll]);

    // Transform style generator for different parallax speeds
    const getParallaxStyle = (speedMultiplier = 1) => ({
        transform: `translate3d(${offset.x * speedMultiplier}px, ${(offset.y - offset.scrollY) * speedMultiplier}px, 0)`
    });

    return { ref, offset, getParallaxStyle };
};

/**
 * Parallax layer component helper styles
 */
export const parallaxLayers = {
    far: { speed: 0.2, blur: 2, opacity: 0.3 },      // Slowest, most blurred
    mid: { speed: 0.5, blur: 0, opacity: 0.6 },      // Medium speed
    near: { speed: 0.8, blur: 0, opacity: 1 },       // Fastest, clearest
    background: { speed: 0.1, blur: 4, opacity: 0.2 } // Very slow background
};

export default useParallax;
