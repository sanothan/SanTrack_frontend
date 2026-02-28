import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { issueService } from '../services/issueService';

const IssueTracking = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const data = await issueService.getIssues();
            setIssues(data);
        } catch (error) {
            console.error("Failed to fetch issues", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="flex items-center text-red-700 bg-red-100 px-2.5 py-1 rounded-full text-xs font-medium w-max"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>;
            case 'in_progress': return <span className="flex items-center text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-xs font-medium w-max"><Clock className="w-3 h-3 mr-1" /> In Progress</span>;
            case 'resolved': return <span className="flex items-center text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-xs font-medium w-max"><CheckCircle2 className="w-3 h-3 mr-1" /> Resolved</span>;
            default: return <span>{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Issue Tracking</h1>
                    <p className="text-muted-foreground">Monitor and resolve facility issues.</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4">Issue ID / Title</th>
                                <th className="px-6 py-4">Facility</th>
                                <th className="px-6 py-4">Reported On</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        Loading issues...
                                    </td>
                                </tr>
                            ) : issues.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        No tracking issues found.
                                    </td>
                                </tr>
                            ) : issues.map(issue => (
                                <tr key={issue._id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-muted-foreground block mb-1">
                                            {issue.isPublic ? 'Public Report' : 'Inspector Field Report'}
                                        </span>
                                        <span className="font-medium line-clamp-2" title={issue.description}>{issue.description}</span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {issue.facilityId?.name || 'Unknown Facility'}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Date(issue.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(issue.status)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <select
                                            value={issue.status}
                                            onChange={(e) => {
                                                issueService.updateIssue(issue._id, { status: e.target.value })
                                                    .then(() => fetchIssues())
                                                    .catch(err => console.error(err));
                                            }}
                                            className="text-sm border rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">Set In Progress</option>
                                            <option value="resolved">Mark Resolved</option>
                                        </select>
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

export default IssueTracking;
