import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Edges } from '@react-three/drei';
import * as THREE from 'three';

// Single Glass Cube with glowing edges and enhanced animations
const GlassCube = ({ position, size = 1, rotationSpeed = 0.2, color = '#22d3ee', delay = 0, mousePos }) => {
    const meshRef = useRef();
    const glowRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime() + delay;

        // Base rotation - faster on hover
        const speed = hovered ? rotationSpeed * 2 : rotationSpeed;
        meshRef.current.rotation.x = Math.sin(time * speed) * 0.3;
        meshRef.current.rotation.y = time * speed * 0.5;
        meshRef.current.rotation.z = Math.cos(time * speed * 0.5) * 0.2;

        // Floating motion with enhanced amplitude
        meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;

        // Mouse-follow tilt (subtle)
        if (mousePos) {
            const tiltX = mousePos.y * 0.1;
            const tiltY = mousePos.x * 0.1;
            meshRef.current.rotation.x += tiltX;
            meshRef.current.rotation.y += tiltY;
        }

        // Pulse glow effect - opacity 0.4 to 1.0 every 3 seconds
        if (glowRef.current) {
            const pulse = Math.sin(time * (Math.PI * 2 / 3)) * 0.3 + 0.7;
            glowRef.current.material.opacity = 0.15 * pulse;
        }
    });

    return (
        <group
            position={position}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >
            <mesh ref={meshRef} scale={hovered ? size * 1.1 : size}>
                <boxGeometry args={[1, 1, 1]} />

                {/* Main glass material */}
                <meshPhysicalMaterial
                    color={color}
                    transparent
                    opacity={0.2}
                    roughness={0.05}
                    metalness={0.1}
                    transmission={0.95}
                    thickness={0.5}
                    envMapIntensity={2}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    side={THREE.DoubleSide}
                />

                {/* Glowing edges */}
                <Edges
                    scale={1}
                    threshold={15}
                    color={color}
                    lineWidth={hovered ? 3 : 2}
                />
            </mesh>

            {/* Inner glow effect with pulsing */}
            <mesh ref={glowRef} position={[0, 0, 0]} scale={size * 0.5}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Outer glow sphere */}
            <mesh scale={size * 1.8}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={hovered ? 0.06 : 0.03}
                />
            </mesh>
        </group>
    );
};

// Ambient floating particles inside scene
const FloatingParticles = ({ mousePos }) => {
    const particlesRef = useRef();
    const count = 150;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!particlesRef.current) return;
        const time = state.clock.getElapsedTime();

        // Gentle rotation
        particlesRef.current.rotation.y = time * 0.02;
        particlesRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;

        // Mouse influence on particles
        if (mousePos) {
            particlesRef.current.rotation.y += mousePos.x * 0.001;
            particlesRef.current.rotation.x += mousePos.y * 0.001;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color="#22d3ee"
                transparent
                opacity={0.5}
                sizeAttenuation
            />
        </points>
    );
};

// Mouse tracking component inside Canvas
const MouseTracker = ({ onMouseMove }) => {
    const { viewport } = useThree();

    useFrame((state) => {
        const x = (state.mouse.x * viewport.width) / 2;
        const y = (state.mouse.y * viewport.height) / 2;
        onMouseMove({ x: state.mouse.x, y: state.mouse.y });
    });

    return null;
};

// Main Three Cube System with mouse interaction
const ThreeCubeSystem = () => {
    const groupRef = useRef();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();

        // Gentle group sway
        groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.15;
        groupRef.current.rotation.x = Math.cos(time * 0.08) * 0.05;

        // Mouse follow for entire group (subtle tilt)
        groupRef.current.rotation.y += mousePos.x * 0.05;
        groupRef.current.rotation.x += mousePos.y * 0.03;
    });

    return (
        <>
            <MouseTracker onMouseMove={setMousePos} />
            <group ref={groupRef}>
                {/* Large back-left cube - Blue */}
                <GlassCube
                    position={[-2, 0.3, -1.2]}
                    size={2.4}
                    rotationSpeed={0.12}
                    color="#3b82f6"
                    delay={0}
                    mousePos={mousePos}
                />

                {/* Medium front-right cube - Cyan */}
                <GlassCube
                    position={[1.8, -0.3, 0.8]}
                    size={1.8}
                    rotationSpeed={0.18}
                    color="#22d3ee"
                    delay={1}
                    mousePos={mousePos}
                />

                {/* Small top-right cube - Light cyan */}
                <GlassCube
                    position={[2.8, 1, -0.3]}
                    size={1.1}
                    rotationSpeed={0.22}
                    color="#06b6d4"
                    delay={2}
                    mousePos={mousePos}
                />

                {/* Ambient glow in center */}
                <mesh position={[0, 0, 0]} scale={[7, 7, 7]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial
                        color="#0ea5e9"
                        transparent
                        opacity={0.012}
                    />
                </mesh>

                {/* Floating particles */}
                <FloatingParticles mousePos={mousePos} />
            </group>
        </>
    );
};

// Main component with enhanced lighting
const HeroCubeAnimation = ({ className = '' }) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                style={{ background: 'transparent' }}
            >
                {/* Enhanced lighting setup */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#3b82f6" />
                <pointLight position={[-10, -10, 10]} intensity={0.8} color="#22d3ee" />
                <pointLight position={[0, 10, -10]} intensity={0.5} color="#0ea5e9" />
                <pointLight position={[5, -5, 5]} intensity={0.4} color="#06b6d4" />
                <pointLight position={[-5, 5, -5]} intensity={0.3} color="#8b5cf6" />

                {/* Subtle stars background */}
                <Stars
                    radius={120}
                    depth={60}
                    count={800}
                    factor={3}
                    saturation={0}
                    fade
                    speed={0.2}
                />

                {/* Main cube system with floating animation */}
                <Float speed={0.4} rotationIntensity={0.03} floatIntensity={0.15}>
                    <ThreeCubeSystem />
                </Float>
            </Canvas>
        </div>
    );
};

export default HeroCubeAnimation;
