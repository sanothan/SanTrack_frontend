import React, { useState, useEffect } from 'react';
import { Search, ClipboardCheck, ArrowUpRight, Activity, CalendarDays, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { inspectionService } from '../services/inspectionService';

const InspectionManagement = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [inspections, setInspections] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInspections();
    }, []);

    const fetchInspections = async () => {
        setLoading(true);
        try {
            const data = await inspectionService.getInspections();
            setInspections(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = inspections.filter(i =>
        (i.facilityId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (i.inspectorId?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyle = (status) => {
        if (status === 'good') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        if (status === 'needs_attention') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    };

    const formatStatus = (status) => status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Inspection Records</h1>
                    <p className="text-muted-foreground">View and manage all sanitation field reports.</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by facility or inspector name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Facility</th>
                                <th scope="col" className="px-6 py-3">Inspector</th>
                                <th scope="col" className="px-6 py-3">Score & Status</th>
                                {isAdmin && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        <span className="animate-pulse">Loading data...</span>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        No inspections found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((inspection) => (
                                    <tr key={inspection._id} className="bg-card border-b hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-muted-foreground font-medium">
                                                <CalendarDays className="w-4 h-4 mr-2" />
                                                {new Date(inspection.date || inspection.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{inspection.facilityId?.name || 'Unknown Facility'}</div>
                                            <div className="text-xs text-muted-foreground text-primary flex items-center mt-1 cursor-pointer hover:underline">
                                                View details <ArrowUpRight className="w-3 h-3 ml-0.5" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {inspection.inspectorId?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-baseline space-x-1 border rounded-md px-2 py-1 bg-muted/50">
                                                    <span className="text-sm font-bold">{inspection.score}</span>
                                                    <span className="text-xs text-muted-foreground">/10</span>
                                                </div>
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center border ${getStatusStyle(inspection.status)}`}>
                                                    <Activity className="w-3 h-3 mr-1" />
                                                    {formatStatus(inspection.status)}
                                                </span>
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-4 h-4 inline" /></button>
                                                <button className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t bg-muted/30 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Showing {filtered.length} entries</span>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionManagement;
