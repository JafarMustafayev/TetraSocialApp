import { Link, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Users, FileText, ShieldBan, TrendingUp, ChevronRight } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import StatCard from '../components/admin/StatCard';
import { getAdminStats } from '../api/admin';

export default function AdminDashboard() {
    const { onMenuClick } = useOutletContext();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const result = await getAdminStats();
                if (result?.success) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);


    const cards = [
        { label: 'Active Users', value: stats?.activeUserCount || 0, icon: Users, color: 'violet' },
        { label: 'Posts', value: stats?.totalPostCount || 0, icon: FileText, color: 'blue' },
        { label: 'Banned Users', value: stats?.bannedUserCount || 0, icon: ShieldBan, color: 'red' },
        { label: 'New Today Posts', value: stats?.todayPostsCount || 0, icon: TrendingUp, color: 'amber' },
    ];

    const navCards = [
        {
            title: 'Manage Users',
            desc: 'View, search, and manage system users',
            to: '/dashboard/users',
            icon: Users,
            color: 'violet'
        },
        {
            title: 'Manage Posts',
            desc: 'Review and moderate community posts',
            to: '/dashboard/posts',
            icon: FileText,
            color: 'blue'
        }
    ];

    return (
        <div className="flex flex-col h-full font-inter">
            <AdminHeader title="Dashboard" onMenuClick={onMenuClick} />
            <main className="flex-1 p-6 overflow-y-auto space-y-8">
                {/* Stats grid */}
                <div className="border border-white/5 rounded-2xl p-4 lg:p-6 bg-white/[0.01]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((c) => (
                            <StatCard key={c.label} {...c} />
                        ))}
                    </div>
                </div>


                {/* Navigation Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {navCards.map((nav) => (
                        <Link
                            key={nav.to}
                            to={nav.to}
                            className="group relative bg-[#0f1117] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 overflow-hidden"
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-${nav.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-xl bg-${nav.color}-500/10 flex items-center justify-center text-${nav.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                                        <nav.icon size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{nav.title}</h3>
                                        <p className="text-white/30 text-sm mt-0.5">{nav.desc}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 group-hover:text-white group-hover:translate-x-1 transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
