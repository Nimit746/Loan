import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import AnimatedButton from '../components/AnimatedButton';
import {
    FiTrendingUp, FiTrendingDown, FiUsers, FiDollarSign,
    FiCheckCircle, FiXCircle, FiActivity, FiPieChart,
    FiBarChart2, FiClock, FiPercent, FiShield
} from 'react-icons/fi';

// Simple animated bar chart component
const BarChart = ({ data, title, color = 'blue' }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    const colorMap = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        purple: 'from-purple-500 to-indigo-500',
        orange: 'from-orange-500 to-amber-500'
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="text-white font-bold">{item.value}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Donut chart component
const DonutChart = ({ approved, rejected, pending }) => {
    const total = approved + rejected + pending;
    const approvedPercent = (approved / total) * 100;
    const rejectedPercent = (rejected / total) * 100;
    const pendingPercent = (pending / total) * 100;

    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    const approvedOffset = 0;
    const rejectedOffset = approvedPercent;
    const pendingOffset = approvedPercent + rejectedPercent;

    return (
        <div className="flex items-center justify-center gap-8">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="16"
                    />
                    {/* Approved segment - Green */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="16"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference * (1 - approvedPercent / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    {/* Rejected segment - Red */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="16"
                        strokeDasharray={`${circumference * rejectedPercent / 100} ${circumference}`}
                        strokeDashoffset={-circumference * approvedPercent / 100}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    {/* Pending segment - Yellow */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="16"
                        strokeDasharray={`${circumference * pendingPercent / 100} ${circumference}`}
                        strokeDashoffset={-circumference * (approvedPercent + rejectedPercent) / 100}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{total}</span>
                    <span className="text-xs text-slate-400">Total</span>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-slate-400">Approved</span>
                    <span className="text-sm font-bold text-white ml-auto">{approved}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-slate-400">Rejected</span>
                    <span className="text-sm font-bold text-white ml-auto">{rejected}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-400">Pending</span>
                    <span className="text-sm font-bold text-white ml-auto">{pending}</span>
                </div>
            </div>
        </div>
    );
};

// Line chart component
const LineChart = ({ data, title }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * 280 + 20;
        const y = 80 - ((value - minValue) / range) * 60;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <svg className="w-full h-24" viewBox="0 0 320 100">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                    <line
                        key={i}
                        x1="20"
                        y1={20 + i * 15}
                        x2="300"
                        y2={20 + i * 15}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                    />
                ))}
                {/* Gradient area */}
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.polygon
                    points={`20,80 ${points} 300,80`}
                    fill="url(#lineGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
                {/* Line */}
                <motion.polyline
                    points={points}
                    fill="none"
                    stroke="url(#lineStroke)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                />
                <defs>
                    <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                </defs>
                {/* Data points */}
                {data.map((value, i) => {
                    const x = (i / (data.length - 1)) * 280 + 20;
                    const y = 80 - ((value - minValue) / range) * 60;
                    return (
                        <motion.circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#3b82f6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

// Stat card component
const StatCard = ({ icon: Icon, label, value, change, changeType, color = 'blue' }) => {
    const colorMap = {
        blue: 'text-blue-400 bg-blue-500/10',
        green: 'text-green-400 bg-green-500/10',
        purple: 'text-purple-400 bg-purple-500/10',
        orange: 'text-orange-400 bg-orange-500/10',
        cyan: 'text-cyan-400 bg-cyan-500/10'
    };

    return (
        <GlassCard className="p-5">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {changeType === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                        {change}%
                    </div>
                )}
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
        </GlassCard>
    );
};

// Recent activity component
const RecentActivity = ({ activities }) => (
    <div className="space-y-4">
        <h4 className="text-sm font-bold text-white">Recent Activity</h4>
        <div className="space-y-3">
            {activities.map((activity, i) => (
                <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.approved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {activity.approved ? <FiCheckCircle /> : <FiXCircle />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-white font-medium">{activity.applicant}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-white">₹{activity.amount}</p>
                        <p className={`text-xs ${activity.approved ? 'text-green-400' : 'text-red-400'}`}>
                            {activity.approved ? 'Approved' : 'Rejected'}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

const DashboardPage = () => {
    // Sample data
    const monthlyData = [
        { label: 'January', value: 145 },
        { label: 'February', value: 189 },
        { label: 'March', value: 234 },
        { label: 'April', value: 198 },
        { label: 'May', value: 267 },
        { label: 'June', value: 312 }
    ];

    const weeklyTrend = [45, 52, 48, 61, 55, 67, 72];

    const recentActivities = [
        { applicant: 'Rahul Sharma', amount: '15,00,000', approved: true, time: '2 mins ago' },
        { applicant: 'Priya Patel', amount: '8,50,000', approved: true, time: '15 mins ago' },
        { applicant: 'Amit Kumar', amount: '25,00,000', approved: false, time: '32 mins ago' },
        { applicant: 'Sneha Reddy', amount: '12,00,000', approved: true, time: '1 hour ago' },
        { applicant: 'Vikram Singh', amount: '5,00,000', approved: false, time: '2 hours ago' }
    ];

    const riskDistribution = [
        { label: 'Low Risk', value: 456 },
        { label: 'Medium Risk', value: 234 },
        { label: 'High Risk', value: 89 }
    ];

    return (
        <div className="min-h-screen relative pb-20">
            {/* Page Header */}
            <div className="main-container mb-12">
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                >
                    <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-3 block">
                        Analytics Overview
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 font-premium">
                        Decision <span className="gradient-text italic">Dashboard</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base font-light leading-relaxed">
                        Real-time analytics and insights from our AI-powered loan decision engine.
                    </p>
                </motion.div>
            </div>

            <div className="main-container">
                {/* Stats Row */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <StatCard
                        icon={FiUsers}
                        label="Total Applications"
                        value="1,247"
                        change="12.5"
                        changeType="up"
                        color="blue"
                    />
                    <StatCard
                        icon={FiCheckCircle}
                        label="Approved"
                        value="892"
                        change="8.2"
                        changeType="up"
                        color="green"
                    />
                    <StatCard
                        icon={FiDollarSign}
                        label="Total Disbursed"
                        value="₹45.2Cr"
                        change="15.3"
                        changeType="up"
                        color="cyan"
                    />
                    <StatCard
                        icon={FiPercent}
                        label="Approval Rate"
                        value="71.5%"
                        change="2.1"
                        changeType="down"
                        color="purple"
                    />
                </motion.div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Donut Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <GlassCard className="p-6 h-full">
                            <h4 className="text-sm font-bold text-white mb-6">Application Status</h4>
                            <DonutChart approved={892} rejected={287} pending={68} />
                        </GlassCard>
                    </motion.div>

                    {/* Line Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <GlassCard className="p-6 h-full">
                            <LineChart data={weeklyTrend} title="Weekly Trend (Applications)" />
                            <div className="flex justify-between mt-4 text-xs text-slate-500">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {/* Bottom Row */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <GlassCard className="p-6 h-full">
                            <BarChart data={monthlyData} title="Monthly Applications" color="blue" />
                        </GlassCard>
                    </motion.div>

                    {/* Risk Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <GlassCard className="p-6 h-full">
                            <BarChart data={riskDistribution} title="Risk Distribution" color="purple" />
                        </GlassCard>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <GlassCard className="p-6 h-full">
                            <RecentActivity activities={recentActivities} />
                        </GlassCard>
                    </motion.div>
                </div>
            </div>

            {/* Ambient glow effects */}
            <div className="absolute top-40 right-0 w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-40 left-0 w-[25%] h-[25%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default DashboardPage;
