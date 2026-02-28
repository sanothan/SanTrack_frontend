import React, { useEffect, useState } from 'react';
import {
    Building2,
    MapPin,
    ClipboardCheck,
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
        inspections: 0,
        pendingIssues: 0
    });
    const [recentInspections, setRecentInspections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data.counts);
                setRecentInspections(data.recentInspections);
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                        title="Recent Inspections"
                        value={stats.inspections}
                        icon={ClipboardCheck}
                        color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        link="/admin/inspections"
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

            {/* Recent Inspections Table */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                    <h2 className="text-lg font-semibold tracking-tight">Recent Inspections</h2>
                    <Link to="/admin/inspections" className="text-xs font-medium text-primary hover:underline">View all</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-3">Facility</th>
                                <th className="px-6 py-3">Inspector</th>
                                <th className="px-6 py-3">Score</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {recentInspections.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground italic">
                                        No recent inspections found.
                                    </td>
                                </tr>
                            ) : recentInspections.map((inspection) => (
                                <tr key={inspection._id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">{inspection.facilityId?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{inspection.inspectorId?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1">
                                            <span className="font-bold">{inspection.score}</span>
                                            <span className="text-xs text-muted-foreground">/10</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(inspection.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${inspection.status === 'good' ? 'bg-green-100 text-green-700 border-green-200' :
                                                inspection.status === 'needs_attention' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                    'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                            {inspection.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
