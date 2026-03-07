import React, { useState, useEffect } from 'react';
import { Users, FileText, ShieldBan, TrendingUp } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import StatCard from '../components/admin/StatCard';
import { getAdminStats } from '../api/admin';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminStats()
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'indigo' },
        { label: 'Total Posts', value: stats?.totalPosts, icon: FileText, color: 'emerald' },
        { label: 'Banned Users', value: stats?.bannedUsers, icon: ShieldBan, color: 'rose' },
        { label: 'New Today', value: stats?.newToday, icon: TrendingUp, color: 'amber' },
    ];

    return (
        <div className="flex flex-col h-full">
            <AdminHeader title="Dashboard" />
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    {cards.map((c) => (
                        <StatCard key={c.label} {...c} />
                    ))}
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <QuickLink
                        to="/admin/users"
                        title="Manage Users"
                        description="View, ban or unban registered users."
                        icon={<Users size={22} className="text-indigo-400" />}
                        badgeColor="bg-indigo-500/10 border-indigo-500/20"
                    />
                    <QuickLink
                        to="/admin/posts"
                        title="Manage Posts"
                        description="Review and delete inappropriate posts."
                        icon={<FileText size={22} className="text-emerald-400" />}
                        badgeColor="bg-emerald-500/10 border-emerald-500/20"
                    />
                </div>
            </main>
        </div>
    );
}

function QuickLink({ to, title, description, icon, badgeColor }) {
    return (
        <Link
            to={to}
            className="group block bg-white/3 hover:bg-white/5 border border-white/5 rounded-2xl p-6 transition-all duration-200"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${badgeColor}`}>
                {icon}
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-indigo-300 transition-colors">{title}</h3>
            <p className="text-slate-500 text-sm">{description}</p>
        </Link>
    );
}
