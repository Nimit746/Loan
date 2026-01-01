import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera, Sparkles, Effects } from '@react-three/drei';
import * as THREE from 'three';

// Cinematic floating shape with slow, ambient movement
const FloatingShape = ({ position, color, size, speed, shapeType }) => {
    const meshRef = useRef();
    const initialPosition = useMemo(() => position, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Very slow, cinematic rotations
        meshRef.current.rotation.x = Math.sin(time * speed * 0.15) * 0.3;
        meshRef.current.rotation.y = Math.cos(time * speed * 0.12) * 0.3;
        meshRef.current.rotation.z = Math.sin(time * speed * 0.08) * 0.1;

        // Gentle floating motion
        meshRef.current.position.y = initialPosition[1] + Math.sin(time * speed * 0.3) * 1.2;

        // Subtle Z-space drift for depth
        meshRef.current.position.z = initialPosition[2] + Math.sin(time * 0.05) * 2;
        meshRef.current.position.x = initialPosition[0] + Math.cos(time * 0.03) * 0.8;
    });

    return (
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.8}>
            <mesh ref={meshRef} position={position}>
                {shapeType === 'cube' ? (
                    <boxGeometry args={[size, size, size]} />
                ) : shapeType === 'sphere' ? (
                    <sphereGeometry args={[size * 0.6, 32, 32]} />
                ) : shapeType === 'torus' ? (
                    <torusGeometry args={[size * 0.5, size * 0.15, 16, 32]} />
                ) : (
                    <octahedronGeometry args={[size * 0.8]} />
                )}
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.12}
                    roughness={0.15}
                    metalness={0.9}
                    emissive={color}
                    emissiveIntensity={0.6}
                />
            </mesh>
        </Float>
    );
};

// Enhanced mouse parallax with smooth damping
const MouseParallax = () => {
    const { camera } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        if (!camera) return;

        // Smooth damping for cinematic feel
        target.current.x += (mouse.current.x * 3 - target.current.x) * 0.02;
        target.current.y += (mouse.current.y * 3 - target.current.y) * 0.02;

        camera.position.x = target.current.x;
        camera.position.y = target.current.y;
        camera.lookAt(0, 0, 0);
    });

    return null;
};

// Animated connecting grid with node network
const ConnectingGrid = ({ count = 40 }) => {
    const pointsRef = useRef();

    const points = useMemo(() => {
        const p = [];
        for (let i = 0; i < count; i++) {
            p.push(new THREE.Vector3(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80
            ));
        }
        return p;
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.getElapsedTime();

        // Subtle pulsing for nodes
        pointsRef.current.children.forEach((mesh, i) => {
            const scale = 1 + Math.sin(time * 0.5 + i * 0.3) * 0.15;
            mesh.scale.setScalar(scale);
        });
    });

    return (
        <group ref={pointsRef}>
            {points.map((p, i) => (
                <mesh key={i} position={p}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshBasicMaterial
                        color="#3b82f6"
                        transparent
                        opacity={0.15 + Math.random() * 0.1}
                    />
                </mesh>
            ))}
            <Sparkles
                count={150}
                scale={60}
                size={1.5}
                speed={0.15}
                opacity={0.08}
                color="#22d3ee"
            />
        </group>
    );
};

// Animated gradient wave plane
const GradientWave = () => {
    const meshRef = useRef();
    const materialRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Very slow wave motion
        meshRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 0.1) * 0.05;
        meshRef.current.position.y = -30 + Math.sin(time * 0.15) * 2;
    });

    return (
        <mesh ref={meshRef} position={[0, -30, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[200, 200, 50, 50]} />
            <meshStandardMaterial
                ref={materialRef}
                color="#0a1628"
                transparent
                opacity={0.3}
                wireframe
                emissive="#3b82f6"
                emissiveIntensity={0.1}
            />
        </mesh>
    );
};

// Light rays for ambient atmosphere
const LightRays = () => {
    const rayRef = useRef();

    useFrame((state) => {
        if (!rayRef.current) return;
        const time = state.clock.getElapsedTime();

        // Slow diagonal drift
        rayRef.current.rotation.z = time * 0.02;
        rayRef.current.position.x = Math.sin(time * 0.05) * 5;
    });

    return (
        <group ref={rayRef}>
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[i * 15 - 30, 20, -50]} rotation={[0, 0, Math.PI / 4]}>
                    <planeGeometry args={[2, 100]} />
                    <meshBasicMaterial
                        color="#3b82f6"
                        transparent
                        opacity={0.02}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
};

const ThreeScene = () => {
    const shapes = useMemo(() => {
        const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#6366f1', '#22d3ee'];
        const types = ['cube', 'sphere', 'octahedron', 'torus'];
        return Array.from({ length: 30 }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80
            ],
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 2.5 + 1,
            speed: Math.random() * 0.2 + 0.05, // Slower speeds for cinematic feel
            shapeType: types[Math.floor(Math.random() * types.length)]
        }));
    }, []);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 40]} fov={70} />
            <MouseParallax />

            {/* Soft ambient lighting */}
            <ambientLight intensity={0.15} />
            <pointLight position={[30, 30, 30]} intensity={1} color="#3b82f6" />
            <pointLight position={[-30, -30, 30]} intensity={0.8} color="#8b5cf6" />
            <spotLight
                position={[-20, 20, 20]}
                angle={0.3}
                penumbra={1}
                intensity={1.5}
                color="#06b6d4"
            />

            {/* Star field - slower for cinematic */}
            <Stars
                radius={200}
                depth={80}
                count={8000}
                factor={4}
                saturation={0.3}
                fade
                speed={0.2}
            />

            {/* Floating shapes */}
            {shapes.map((shape, i) => (
                <FloatingShape key={i} {...shape} />
            ))}

            {/* Network grid */}
            <ConnectingGrid />

            {/* Gradient wave floor */}
            <GradientWave />

            {/* Light rays */}
            <LightRays />

            {/* Fog for depth */}
            <fog attach="fog" args={['#020617', 30, 120]} />
        </>
    );
};

const ThreeBackground = () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Delay rendering for smooth page load
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady) return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                shadows
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                style={{ background: '#020617' }}
            >
                <ThreeScene />
            </Canvas>

            {/* Cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617] opacity-40" />

            {/* Soft radial glow */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)]" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1)_0%,transparent_50%)]" />

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#020617_100%)] opacity-60" />
        </div>
    );
};

export default ThreeBackground;
