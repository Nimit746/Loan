import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Product: [
            { name: 'Core Engine', href: '/how-it-works' },
            { name: 'Predictor', href: '/predict' },
            { name: 'Integration', href: '#' },
            { name: 'Enterprise', href: '#' },
        ],
        Company: [
            { name: 'About Mission', href: '/about' },
            { name: 'Ethical AI', href: '#' },
            { name: 'Research', href: '#' },
            { name: 'Contact', href: '#' },
        ],
        Resources: [
            { name: 'Technical Docs', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Case Studies', href: '#' },
            { name: 'Community', href: '#' },
        ],
    };

    const socialLinks = [
        { icon: FiGithub, href: '#', label: 'GitHub' },
        { icon: FiTwitter, href: '#', label: 'Twitter' },
        { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
        { icon: FiMail, href: '#', label: 'Email' },
    ];

    return (
        <footer className="relative border-t border-white/5 bg-[#020617] pt-20 pb-10">
            <div className="main-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-3">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                <FiZap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white font-premium">
                                Loan<span className="gradient-text italic">AI</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 mb-8 max-w-sm leading-relaxed font-light text-sm">
                            Pioneering autonomous financial intelligence through multimodal deep learning
                            and radical transparency. Built for the future of decentralized lending.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-11 h-11 rounded-xl glass-morphism flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-300"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="lg:col-span-1">
                            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">{category}</h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.href}
                                            className="text-slate-500 hover:text-white transition-colors text-sm font-medium"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-slate-600 text-xs font-bold tracking-widest">
                            © {currentYear} LOANAI PROTOCOL
                        </p>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-800" />
                        <div className="flex gap-6">
                            <Link to="#" className="text-slate-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Privacy</Link>
                            <Link to="#" className="text-slate-600 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Terms</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 rounded-full glass-morphism border border-white/5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Network Active</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
