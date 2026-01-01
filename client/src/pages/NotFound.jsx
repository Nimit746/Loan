import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import AnimatedButton from '../components/AnimatedButton';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center relative pt-20">
            <div className="content-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* 404 Display */}
                    <motion.div
                        className="mb-8"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <span className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 leading-none">
                            404
                        </span>
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                        className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-6 border border-orange-500/20"
                        animate={{
                            boxShadow: [
                                '0 0 0 rgba(249, 115, 22, 0)',
                                '0 0 30px rgba(249, 115, 22, 0.3)',
                                '0 0 0 rgba(249, 115, 22, 0)'
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <FiAlertTriangle className="w-10 h-10 text-orange-400" />
                    </motion.div>

                    {/* Message */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-premium">
                        Page Not Found
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md mx-auto mb-10 font-light">
                        The neural pathway you're looking for doesn't exist in our network.
                    </p>

                    {/* CTA */}
                    <Link to="/">
                        <AnimatedButton
                            variant="primary"
                            size="lg"
                            icon={<FiHome />}
                            iconPosition="left"
                            className="px-8"
                        >
                            Return Home
                        </AnimatedButton>
                    </Link>
                </motion.div>
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        </div>
    );
};

export default NotFound;