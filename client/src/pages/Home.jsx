import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/sections/HeroSection';
import FeaturesCarousel from '../components/sections/FeaturesCarousel';
import MultimodalInputSection from '../components/sections/MultimodalInputSection';
import AIFlowSection from '../components/sections/AIFlowSection';
import TrustSection from '../components/sections/TrustSection';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const goToPredict = () => {
        navigate('/predict');
    };

    const goToHowItWorks = () => {
        navigate('/how-it-works');
    };

    return (
        <div className="relative">
            {/* Hero Section */}
            <section id="hero">
                <HeroSection
                    onStartPrediction={goToPredict}
                    onHowItWorks={goToHowItWorks}
                />
            </section>

            {/* TDA-Style Features Carousel */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
            >
                <FeaturesCarousel />
            </motion.section>

            {/* Multimodal Input Section */}
            <motion.section
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            >
                <MultimodalInputSection />
            </motion.section>

            {/* AI Flow Pipeline Section */}
            <motion.section
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            >
                <AIFlowSection />
            </motion.section>

            {/* Trust Section */}
            <motion.section
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            >
                <TrustSection />
            </motion.section>
        </div>
    );
};

export default Home;
