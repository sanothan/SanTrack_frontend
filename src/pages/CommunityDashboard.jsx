import React, { useState, useEffect } from 'react';
import { Activity, Building2, ShieldCheck, AlertTriangle, Eye } from 'lucide-react';
import { issueService } from '../services/issueService';
import { dashboardService } from '../services/dashboardService';
import { Link } from 'react-router-dom';

const CommunityDashboard = () => {
    const [stats, setStats] = useState({ activeFacilities: 0, hygieneScore: 0, openIssues: 0 });
    const [recentIssues, setRecentIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [issuesData, dashboardStats] = await Promise.all([
                    issueService.getIssues(),
                    dashboardService.getStats()
                ]);
                setRecentIssues(issuesData.slice(0, 5));
                setStats({
                    activeFacilities: dashboardStats.facilityStats.total,
                    hygieneScore: Math.round(dashboardStats.inspectionStats.avgScore * 10) / 10 || 0,
                    openIssues: issuesData.filter(i => i.status !== 'resolved').length
                });
            } catch (err) {
                console.error("Error fetching community dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Community Dashboard</h1>
                <p className="text-muted-foreground">Track the sanitation and hygiene status of your local facilities.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 break-words">
                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Regional Hygiene Score</p>
                            <h3 className="text-3xl font-bold mt-2 text-green-600">{stats.hygieneScore}<span className="text-base font-normal text-muted-foreground">/10</span></h3>
                        </div>
                        <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        Overall average from all inspections
                    </div>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Facilities</p>
                            <h3 className="text-3xl font-bold mt-2">{stats.activeFacilities}</h3>
                        </div>
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                            <Building2 className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        Public facilities monitored
                    </div>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">My Open Issues</p>
                            <h3 className="text-3xl font-bold mt-2 text-amber-600">{stats.openIssues}</h3>
                        </div>
                        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        Reports submitted by you
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <h2 className="font-semibold flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-primary" /> My Reported Issues</h2>
                    <Link to="/report" className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors">
                        Report New Issue
                    </Link>
                </div>
                <div className="divide-y">
                    {recentIssues.length > 0 ? (
                        recentIssues.map((issue) => (
                            <div key={issue._id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div>
                                    <h4 className="font-medium">{issue.facilityId?.name || 'Unknown Facility'}</h4>
                                    <p className="text-sm text-muted-foreground truncate max-w-md">{issue.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Reported on {new Date(issue.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                                        issue.status === 'resolved' ? "bg-green-100 text-green-700" :
                                            issue.status === 'in-progress' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {issue.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            You haven't reported any issues yet.
                        </div>
                    )}
                </div>
                {recentIssues.length > 0 && (
                    <div className="p-4 bg-muted/10 text-center border-t">
                        <Link to="/community/issues" className="text-sm text-primary hover:underline font-medium">View All My Issues</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityDashboard;
