import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThreeBackground from '../components/ThreeBackground';
import ParticleBackground from '../components/ParticleBackground';
import ScrollProgress from '../components/ScrollProgress';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-[#020617] selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Global 3D Background */}
            <ThreeBackground />

            {/* Canvas Particle Background */}
            <ParticleBackground />

            {/* Scroll Progress Indicator */}
            <ScrollProgress />

            {/* Navigation */}
            <Navbar />

            {/* Spacer for fixed navbar on non-home pages */}
            {location.pathname !== '/' && (
                <div className="h-32 md:h-40" aria-hidden="true" />
            )}

            {/* Main Content with route transitions */}
            <main className="grow relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
