import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, Torus, MeshDistortMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// 3D Floating Cube Component
const FloatingCube = ({ isActive, color }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
            meshRef.current.rotation.y = time * 0.2;
            meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={isActive ? 1.2 : 0.8}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.7}
                    roughness={0.1}
                    metalness={0.9}
                    emissive={color}
                    emissiveIntensity={isActive ? 0.5 : 0.2}
                />
                {/* Inner glow */}
                <mesh scale={0.95}>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
            </mesh>
        </Float>
    );
};

// 3D Globe/Sphere Component
const FloatingGlobe = ({ isActive }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
            <mesh ref={meshRef} scale={isActive ? 1.5 : 1}>
                <sphereGeometry args={[1.2, 32, 32]} />
                <MeshDistortMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.6}
                    roughness={0.2}
                    metalness={0.8}
                    distort={0.3}
                    speed={2}
                />
            </mesh>
            {/* Wireframe overlay */}
            <mesh scale={isActive ? 1.55 : 1.05}>
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.2} />
            </mesh>
        </Float>
    );
};

// 3D Chart/Bars Component
const FloatingChart = ({ isActive }) => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
        }
    });

    const bars = [0.6, 1, 0.8, 1.2, 0.7];

    return (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={groupRef} scale={isActive ? 1.2 : 0.9}>
                {bars.map((height, i) => (
                    <mesh key={i} position={[(i - 2) * 0.5, height / 2 - 0.5, 0]}>
                        <boxGeometry args={[0.35, height, 0.35]} />
                        <meshStandardMaterial
                            color={i === 3 ? '#22d3ee' : '#3b82f6'}
                            transparent
                            opacity={0.8}
                            metalness={0.7}
                            roughness={0.2}
                            emissive={i === 3 ? '#22d3ee' : '#3b82f6'}
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                ))}
            </group>
        </Float>
    );
};

// Feature Card with 3D Element
const FeatureCard = ({ feature, isActive, onClick }) => {
    return (
        <motion.div
            className={`relative cursor-pointer transition-all duration-500 ${isActive ? 'z-20 scale-100' : 'z-10 scale-90 opacity-60'
                }`}
            onClick={onClick}
            whileHover={{ scale: isActive ? 1.02 : 0.95 }}
        >
            <div className={`
                relative w-[320px] h-[400px] rounded-3xl overflow-hidden
                ${isActive ? 'shadow-2xl shadow-blue-500/20' : ''}
            `}>
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/10" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* 3D Canvas */}
                <div className="absolute inset-0 top-8">
                    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={0.3} />
                        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
                        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#22d3ee" />

                        {feature.shape === 'cube' && <FloatingCube isActive={isActive} color="#3b82f6" />}
                        {feature.shape === 'globe' && <FloatingGlobe isActive={isActive} />}
                        {feature.shape === 'chart' && <FloatingChart isActive={isActive} />}
                    </Canvas>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent">
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">
                        {feature.description}
                    </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                    <motion.div
                        className="absolute top-4 right-4 w-3 h-3 rounded-full bg-cyan-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}

                {/* Border glow */}
                {isActive && (
                    <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/30 animate-pulse" />
                )}
            </div>
        </motion.div>
    );
};

const FeaturesCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const navigate = useNavigate();

    const features = [
        {
            id: 1,
            title: 'AI Risk Engine',
            description: 'Advanced neural networks analyze 100+ risk factors in milliseconds for precise loan approval.',
            shape: 'cube'
        },
        {
            id: 2,
            title: 'Multi-Currency Analysis',
            description: 'Seamless integration with global financial systems for comprehensive asset verification.',
            shape: 'globe'
        },
        {
            id: 3,
            title: 'Real-Time Dashboard',
            description: 'Advanced analytics platform with dynamic visualizations and predictive insights.',
            shape: 'chart'
        }
    ];

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % features.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    };

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </div>

            <div className="main-container relative z-10">
                {/* Section Header */}
                <div className="content-center mb-20">
                    <motion.span
                        className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 block"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Core Capabilities
                    </motion.span>
                    <motion.h2
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Intelligent <span className="gradient-text italic">Solutions</span>
                    </motion.h2>
                    <motion.p
                        className="text-slate-400 text-lg max-w-2xl font-light"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Cutting-edge AI technology powering the next generation of financial risk assessment.
                    </motion.p>
                </div>

                {/* Carousel */}
                <div className="flex items-center justify-center gap-6 mb-16">
                    {/* Navigation Arrows */}
                    <motion.button
                        className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                        onClick={prevSlide}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </motion.button>

                    {/* Cards */}
                    <div className="flex items-center gap-6">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.id}
                                feature={feature}
                                isActive={index === activeIndex}
                                onClick={() => setActiveIndex(index)}
                            />
                        ))}
                    </div>

                    <motion.button
                        className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                        onClick={nextSlide}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-3 mb-12">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-cyan-400' : 'w-1.5 bg-white/20'
                                }`}
                            onClick={() => setActiveIndex(index)}
                        />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <button
                        onClick={() => navigate('/predict')}
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-xl hover:shadow-blue-500/20 transition-all hover:scale-105"
                    >
                        Try Neural Predictor
                        <FiArrowRight />
                    </button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <div className="w-[1px] h-6 bg-gradient-to-b from-slate-500 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesCarousel;
