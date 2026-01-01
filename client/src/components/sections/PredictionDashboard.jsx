import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CircularGauge from '../CircularGauge';
import GlassCard from '../GlassCard';
import AnimatedButton from '../AnimatedButton';
import { FiSearch, FiAlertCircle, FiCheckCircle, FiShield, FiActivity, FiCpu, FiTrendingUp } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PredictionDashboard = () => {
    const [formData, setFormData] = useState({
        income: '9600000',
        loan_amount: '29900000',
        loan_term: '12',
        cibil_score: '778',
        residential_assets: '2400000',
        commercial_assets: '17600000',
        luxury_assets: '22700000',
        bank_assets: '3800000'
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('income_annum', formData.income);
            formDataToSend.append('loan_amount', formData.loan_amount);
            formDataToSend.append('loan_term', formData.loan_term);
            formDataToSend.append('cibil_score', formData.cibil_score);
            formDataToSend.append('residential_assets_value', formData.residential_assets);
            formDataToSend.append('commercial_assets_value', formData.commercial_assets);
            formDataToSend.append('luxury_assets_value', formData.luxury_assets);
            formDataToSend.append('bank_asset_value', formData.bank_assets);

            if (selectedFile) {
                formDataToSend.append('document', selectedFile);
            }

            console.log('Sending prediction request...', Array.from(formDataToSend.keys()));
            const response = await axios.post(`${API_URL}/predict`, formDataToSend);
            console.log('Prediction response received:', response.data);

            const loanAmt = parseFloat(formData.loan_amount) || 1;
            const incomeAmt = parseFloat(formData.income) || 1;
            const totalAssets = (parseFloat(formData.residential_assets) || 0) +
                (parseFloat(formData.commercial_assets) || 0) +
                (parseFloat(formData.luxury_assets) || 0) +
                (parseFloat(formData.bank_assets) || 0);

            setResult({
                ...response.data,
                dtiRatio: (loanAmt / incomeAmt).toFixed(2),
                assetCoverage: (totalAssets / loanAmt).toFixed(2),
                totalAssets,
                assetsBreakdown: [
                    { label: 'Residential', value: parseFloat(formData.residential_assets) || 0, color: 'blue' },
                    { label: 'Commercial', value: parseFloat(formData.commercial_assets) || 0, color: 'cyan' },
                    { label: 'Luxury', value: parseFloat(formData.luxury_assets) || 0, color: 'purple' },
                    { label: 'Bank', value: parseFloat(formData.bank_assets) || 0, color: 'green' }
                ]
            });
        } catch (err) {
            console.error('Prediction error:', err);
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'string' ? detail : (Array.isArray(detail) ? JSON.stringify(detail) : 'Connection failed. Ensure backend is running.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Input Side */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard useRotatingBorder={false} className="p-0 overflow-hidden h-full">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600/10 to-transparent px-5 py-4 border-b border-white/5">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <FiSearch className="text-blue-400 w-4 h-4" />
                                Application Data
                            </h3>
                            <p className="text-slate-500 text-xs mt-0.5">Verify all parameters before analysis.</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-5">
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <InputField label="Annual Income (₹)" name="income" value={formData.income} onChange={handleChange} />
                                <InputField label="Loan Amount (₹)" name="loan_amount" value={formData.loan_amount} onChange={handleChange} />
                                <InputField label="Loan Term (Mo)" name="loan_term" value={formData.loan_term} onChange={handleChange} />
                                <InputField label="CIBIL Score" name="cibil_score" value={formData.cibil_score} onChange={handleChange} />
                                <InputField label="Residential (₹)" name="residential_assets" value={formData.residential_assets} onChange={handleChange} />
                                <InputField label="Commercial (₹)" name="commercial_assets" value={formData.commercial_assets} onChange={handleChange} />
                                <InputField label="Luxury (₹)" name="luxury_assets" value={formData.luxury_assets} onChange={handleChange} />
                                <InputField label="Bank Assets (₹)" name="bank_assets" value={formData.bank_assets} onChange={handleChange} />
                            </div>

                            {/* Multi-modal File Upload */}
                            <div className="mb-5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                    Multi-modal Verification (PDF/JPEG)
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`border border-dashed rounded-lg p-3 text-center transition-all ${selectedFile ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 group-hover:border-white/20'}`}>
                                        <div className="flex items-center justify-center gap-2">
                                            <FiShield className={`w-4 h-4 ${selectedFile ? 'text-blue-400 font-bold' : 'text-slate-500'}`} />
                                            <span className={`text-xs ${selectedFile ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                                                {selectedFile ? selectedFile.name : 'Upload Income Proof / Assets PDF'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AnimatedButton
                                type="submit"
                                variant="primary"
                                className="w-full py-3 text-sm font-bold"
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Processing Multi-modal Input...' : 'Run Neural Prediction'}
                            </AnimatedButton>
                        </form>
                    </GlassCard>
                </motion.div>

                {/* Results Side */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <AnimatePresence mode="wait">
                        {!result && !loading && !error && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[380px] glass-morphism glass-card flex flex-col items-center justify-center p-8 border border-dashed border-white/10"
                            >
                                <div className="w-14 h-14 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                                    <FiActivity className="w-6 h-6 text-slate-500" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">Engine Awaiting Input</h3>
                                <p className="text-slate-500 text-sm text-center">Submit data to see probability analysis</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[380px] glass-morphism glass-card flex flex-col items-center justify-center p-8 border border-blue-500/20"
                            >
                                <div className="relative mb-5">
                                    <div className="w-14 h-14 rounded-full border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
                                    <FiCpu className="absolute inset-0 m-auto w-5 h-5 text-blue-400 animate-pulse" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">Analyzing Risk Matrix</h3>
                                <div className="flex gap-1">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[380px] glass-morphism glass-card flex flex-col items-center justify-center p-8 border border-red-500/20"
                            >
                                <FiAlertCircle className="w-10 h-10 text-red-500 mb-4" />
                                <h3 className="text-base font-bold text-red-400 mb-2">Neural Engine Error</h3>
                                <p className="text-slate-400 text-center max-w-xs text-sm mb-4">{error}</p>
                                <AnimatedButton
                                    variant="secondary"
                                    className="text-xs px-5"
                                    onClick={() => setError(null)}
                                >
                                    Try Again
                                </AnimatedButton>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-4"
                            >
                                {/* Main Result */}
                                <GlassCard glow={true} glowColor={result.approved ? 'blue' : 'red'} className="flex flex-col items-center p-5">
                                    <CircularGauge
                                        value={result.confidence}
                                        label={result.approved ? 'Approved' : 'Rejected'}
                                        description="Confidence"
                                        color={result.approved ? 'blue' : 'red'}
                                        size={160}
                                    />
                                    <div className="mt-3 flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            {result.approved ? (
                                                <FiCheckCircle className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <FiAlertCircle className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className={`font-bold text-sm ${result.approved ? 'text-green-400' : 'text-red-400'}`}>
                                                Loan {result.approved ? 'Approved' : 'Rejected'}
                                            </span>
                                        </div>
                                        {result.verification_status && (
                                            <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-tighter">
                                                {result.verification_status}
                                            </span>
                                        )}
                                    </div>
                                </GlassCard>

                                {/* Metrics */}
                                <div className="grid grid-cols-4 gap-2">
                                    <MetricCard label="CIBIL" value={parseInt(formData.cibil_score) > 700 ? 'Good' : 'Fair'} color={parseInt(formData.cibil_score) > 700 ? 'green' : 'orange'} />
                                    <MetricCard label="Coverage" value={`${result.assetCoverage}x`} color="blue" />
                                    <MetricCard label="DTI" value={result.dtiRatio} color={parseFloat(result.dtiRatio) < 3 ? 'green' : 'orange'} />
                                    <MetricCard label="Models" value={result.models_used?.length || 3} color="purple" />
                                </div>

                                {/* Asset Breakdown Bar Chart */}
                                {result && result.assetsBreakdown && (
                                    <GlassCard className="p-4" delay={0.2}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <FiActivity className="text-blue-400 w-3.5 h-3.5" />
                                                <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Asset Allocation</h4>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">₹{((result.totalAssets || 0) / 10000000).toFixed(2)}Cr Total</span>
                                        </div>
                                        <div className="space-y-3">
                                            {result.assetsBreakdown.map((asset, i) => {
                                                const percentage = result.totalAssets > 0 ? (asset.value / result.totalAssets) * 100 : 0;
                                                return (
                                                    <div key={asset.label} className="space-y-1">
                                                        <div className="flex justify-between text-[10px]">
                                                            <span className="text-slate-400">{asset.label}</span>
                                                            <span className="text-white font-bold">₹{((asset.value || 0) / 10000000).toFixed(2)}Cr</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className={`h-full bg-gradient-to-r ${asset.color === 'blue' ? 'from-blue-600 to-blue-400' : asset.color === 'cyan' ? 'from-cyan-600 to-cyan-400' : asset.color === 'purple' ? 'from-purple-600 to-purple-400' : 'from-green-600 to-green-400'}`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </GlassCard>
                                )}

                                {/* Model Predictions */}
                                {result && result.predictions && (
                                    <GlassCard className="p-4" delay={0.4}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FiTrendingUp className="text-cyan-400 w-3.5 h-3.5" />
                                            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Neural Model Variance</h4>
                                        </div>
                                        <div className="space-y-1.5">
                                            {Object.entries(result.predictions).map(([model, pred]) => (
                                                <div key={model} className="flex items-center justify-between">
                                                    <span className="text-[10px] text-slate-400 capitalize">{model.replace('_', ' ')}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(pred || 0) * 100}%` }}
                                                                transition={{ duration: 0.8, delay: 0.3 }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white w-8 text-right">
                                                            {((pred || 0) * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

// Compact Input Field
const InputField = ({ label, name, value, onChange }) => (
    <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {label}
        </label>
        <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all"
        />
    </div>
);

// Compact Metric Card
const MetricCard = ({ label, value, color }) => {
    const colors = {
        green: 'text-green-400',
        orange: 'text-orange-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        red: 'text-red-400'
    };

    return (
        <div className="p-2.5 glass-morphism rounded-lg border border-white/5 text-center">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</p>
            <p className={`font-bold text-sm ${colors[color] || 'text-white'}`}>{value}</p>
        </div>
    );
};

export default PredictionDashboard;
