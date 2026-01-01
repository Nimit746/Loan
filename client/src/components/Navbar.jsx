import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiZap } from 'react-icons/fi';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navRef = useRef(null);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Predict', path: '/predict' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Process', path: '/how-it-works' },
        { name: 'About', path: '/about' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 20);

            // Calculate scroll progress for dynamic blur
            const maxScroll = 200;
            const progress = Math.min(scrollY / maxScroll, 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Dynamic styles based on scroll
    const navStyle = {
        backdropFilter: `blur(${scrollProgress * 20}px)`,
        WebkitBackdropFilter: `blur(${scrollProgress * 20}px)`,
        backgroundColor: `rgba(2, 6, 23, ${scrollProgress * 0.9})`,
    };

    return (
        <motion.nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'border-b border-white/10' : ''
                }`}
            style={navStyle}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
            <motion.div
                className="main-container"
                animate={{
                    paddingTop: isScrolled ? '16px' : '24px',
                    paddingBottom: isScrolled ? '16px' : '24px',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="flex items-center justify-between">
                    {/* Logo with hover animation */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30"
                            whileHover={{
                                scale: 1.1,
                                rotate: 5,
                                boxShadow: '0 25px 50px rgba(59, 130, 246, 0.5)'
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            >
                                <FiZap className="w-7 h-7 text-white" />
                            </motion.div>
                        </motion.div>
                        <motion.span
                            className="text-3xl font-black text-white tracking-tight font-premium"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                        >
                            Loan<span className="gradient-text-animated italic">AI</span>
                        </motion.span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link, i) => (
                            <NavLink
                                key={link.name}
                                link={link}
                                isActive={location.pathname === link.path}
                                delay={i * 0.05}
                            />
                        ))}
                    </div>

                    {/* CTA Button with shimmer effect */}
                    <div className="hidden md:block">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative overflow-hidden rounded-xl"
                        >
                            <Link
                                to="/predict"
                                className="relative block px-8 py-4 bg-white text-[#020617] text-sm font-black uppercase tracking-widest overflow-hidden"
                            >
                                {/* Shimmer effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                                    animate={{
                                        x: ['-100%', '100%']
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        repeatDelay: 1
                                    }}
                                />
                                <span className="relative z-10">Get Started</span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden w-11 h-11 rounded-xl glass-morphism flex items-center justify-center text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AnimatePresence mode="wait">
                            {isMobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiX className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiMenu className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="md:hidden fixed inset-0 top-[76px] bg-[#020617]/98 backdrop-blur-2xl z-[90]"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <div className="main-container py-12 flex flex-col items-center gap-6">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                >
                                    <Link
                                        to={link.path}
                                        className={`text-3xl font-black font-premium transition-colors ${location.pathname === link.path ? 'text-cyan-400' : 'text-white'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                                className="w-full mt-6"
                            >
                                <Link
                                    to="/predict"
                                    className="block px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xl font-bold text-center"
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

// NavLink component with hover underline animation
const NavLink = ({ link, isActive, delay }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <Link
                to={link.path}
                className={`text-sm font-bold uppercase tracking-[0.15em] relative py-2 block ${isActive ? 'text-cyan-400' : 'text-slate-300'
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <motion.span
                    animate={{
                        color: isHovered && !isActive ? '#ffffff' : undefined
                    }}
                    transition={{ duration: 0.2 }}
                >
                    {link.name}
                </motion.span>

                {/* Underline animation - slides from left on hover */}
                <motion.span
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ width: '0%' }}
                    animate={{
                        width: isActive ? '100%' : isHovered ? '100%' : '0%',
                        opacity: isActive ? 1 : isHovered ? 0.7 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                {/* Active glow indicator */}
                {isActive && (
                    <motion.span
                        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ transform: 'translateX(-50%)' }}
                    />
                )}
            </Link>
        </motion.div>
    );
};

export default Navbar;
