import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Enhanced Particle Background with:
 * - Connected particles within proximity
 * - Mouse repulsion effect
 * - Perlin-like noise movement
 * - Twinkle effects
 * - Floating geometric shapes
 */
const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const particlesRef = useRef([]);
    const shapesRef = useRef([]);
    const animationRef = useRef();

    // Simplex noise approximation for organic movement
    const noise = (x, y, t) => {
        return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * 0.5 +
            Math.sin(x * 0.02 - t * 0.3) * Math.cos(y * 0.015 + t * 0.7) * 0.3 +
            Math.sin(x * 0.005 + t * 0.2) * Math.cos(y * 0.008 - t * 0.4) * 0.2;
    };

    // Initialize particles and shapes
    const init = useCallback((canvas) => {
        const particleCount = window.innerWidth < 768 ? 60 : 120;
        const shapeCount = 8;

        // Create particles
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseX: 0,
            baseY: 0,
            vx: 0,
            vy: 0,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            color: ['#3b82f6', '#22d3ee', '#8b5cf6', '#06b6d4'][Math.floor(Math.random() * 4)]
        }));

        // Store base positions
        particlesRef.current.forEach(p => {
            p.baseX = p.x;
            p.baseY = p.y;
        });

        // Create floating geometric shapes
        shapesRef.current = Array.from({ length: shapeCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 80 + 30,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.005,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            type: Math.floor(Math.random() * 3), // 0: square, 1: hexagon, 2: triangle
            opacity: Math.random() * 0.08 + 0.02
        }));
    }, []);

    // Draw hexagon path
    const drawHexagon = (ctx, x, y, size) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    };

    // Draw triangle path
    const drawTriangle = (ctx, x, y, size) => {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    };

    // Animation loop
    const animate = useCallback((canvas, ctx, time) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = time * 0.001;

        // Update and draw geometric shapes
        shapesRef.current.forEach(shape => {
            // Move shapes
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.rotationSpeed;

            // Wrap around screen
            if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
            if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
            if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
            if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

            // Draw shape
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation);
            ctx.strokeStyle = `rgba(59, 130, 246, ${shape.opacity})`;
            ctx.lineWidth = 1;

            if (shape.type === 0) {
                ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            } else if (shape.type === 1) {
                drawHexagon(ctx, 0, 0, shape.size / 2);
                ctx.stroke();
            } else {
                drawTriangle(ctx, 0, 0, shape.size / 2);
                ctx.stroke();
            }
            ctx.restore();
        });

        // Update particles
        particlesRef.current.forEach(particle => {
            // Noise-based movement
            const noiseX = noise(particle.baseX, particle.baseY, t);
            const noiseY = noise(particle.baseY, particle.baseX, t + 100);

            // Target position with noise
            const targetX = particle.baseX + noiseX * 30;
            const targetY = particle.baseY + noiseY * 30;

            // Mouse repulsion
            const dx = particle.x - mouseRef.current.x;
            const dy = particle.y - mouseRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 150;

            if (distance < repulsionRadius && distance > 0) {
                const force = (repulsionRadius - distance) / repulsionRadius;
                particle.vx += (dx / distance) * force * 2;
                particle.vy += (dy / distance) * force * 2;
            }

            // Apply velocity with friction
            particle.vx *= 0.95;
            particle.vy *= 0.95;

            // Spring back to noise position
            particle.vx += (targetX - particle.x) * 0.02;
            particle.vy += (targetY - particle.y) * 0.02;

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Twinkle effect
            const twinkle = Math.sin(t * particle.twinkleSpeed * 100 + particle.twinkleOffset) * 0.3 + 0.7;
            particle.currentOpacity = particle.opacity * twinkle;
        });

        // Draw connections between nearby particles
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particlesRef.current.length; i++) {
            for (let j = i + 1; j < particlesRef.current.length; j++) {
                const p1 = particlesRef.current[i];
                const p2 = particlesRef.current[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particlesRef.current.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color.replace(')', `, ${particle.currentOpacity})`).replace('rgb', 'rgba').replace('#', '');

            // Convert hex to rgba for proper opacity
            const hex = particle.color;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.currentOpacity})`;
            ctx.fill();

            // Add glow
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        animationRef.current = requestAnimationFrame((t) => animate(canvas, ctx, t));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init(canvas);
        };
        resize();

        // Mouse tracking
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave);

        // Start animation
        animationRef.current = requestAnimationFrame((t) => animate(canvas, ctx, t));

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationRef.current);
        };
    }, [init, animate]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ background: 'transparent' }}
            aria-hidden="true"
        />
    );
};

export default ParticleBackground;
