import React, { useEffect, useState } from 'react';
import {
    Building2,
    MapPin,
    AlertTriangle,
    ArrowRight,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';

const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
        </div>
        <div className="mt-4">
            <span className="text-3xl font-bold">{value}</span>
        </div>
        {link && (
            <Link to={link} className="mt-4 text-sm text-primary flex items-center hover:underline">
                View details <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
        )}
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        villages: 0,
        facilities: 0,
        pendingIssues: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data.counts);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
                    <p className="text-muted-foreground">Monitor system-wide sanitation metrics and operations.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Facility
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Total Villages"
                        value={stats.villages}
                        icon={MapPin}
                        color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        link="/admin/villages"
                    />
                    <StatCard
                        title="Total Facilities"
                        value={stats.facilities}
                        icon={Building2}
                        color="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        link="/admin/facilities"
                    />
                    <StatCard
                        title="Pending Issues"
                        value={stats.pendingIssues}
                        icon={AlertTriangle}
                        color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        link="/admin/issues"
                    />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
