import React, { useState, useEffect } from 'react';
import {
    Search, Activity, CalendarDays, Edit2, Trash2, X, Save,
    ArrowUpRight, CheckCircle, AlertCircle, Building2, User, Loader2, Image
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { inspectionService } from '../services/inspectionService';

/* ─── Helpers ─── */
const getStatusStyle = (status) => {
    if (status === 'good') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'needs_attention') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
};
const formatStatus = (s) => (s || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
const scoreColor = (score) => score >= 7 ? 'text-green-600' : score >= 4 ? 'text-amber-500' : 'text-red-600';

/* ─── Detail / Edit Modal ─── */
const InspectionModal = ({ inspection, onClose, onSaved, onDeleted, isAdmin, currentUser }) => {
    // Inspector can manage their own; admin can manage all
    const canManage = isAdmin || (currentUser?.id && inspection.inspectorId?._id === currentUser.id);
    const [editMode, setEditMode] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(!!inspection._openDelete);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [editData, setEditData] = useState({
        score: inspection.score,
        remarks: inspection.remarks || '',
    });

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const updated = await inspectionService.updateInspection(inspection._id, {
                score: Number(editData.score),
                remarks: editData.remarks,
            });
            onSaved(updated);
            setEditMode(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update inspection.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        setError('');
        try {
            await inspectionService.deleteInspection(inspection._id);
            onDeleted(inspection._id);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete inspection.');
            setConfirmDelete(false);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-card border rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-lg font-bold">Inspection Details</h2>
                    <div className="flex items-center space-x-2">
                        {canManage && !editMode && (
                            <>
                                <button
                                    onClick={() => { setEditMode(true); setConfirmDelete(false); setError(''); }}
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setConfirmDelete(true); setEditMode(false); setError(''); }}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />{error}
                        </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1"><Building2 className="w-3 h-3" /> Facility</p>
                            <p className="font-semibold">{inspection.facilityId?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground capitalize">{inspection.facilityId?.type || ''}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1"><User className="w-3 h-3" /> Inspector</p>
                            <p className="font-semibold">{inspection.inspectorId?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{inspection.inspectorId?.email || ''}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Date</p>
                            <p className="font-semibold">{new Date(inspection.date || inspection.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1"><Activity className="w-3 h-3" /> Status</p>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center border ${getStatusStyle(inspection.status)}`}>
                                {formatStatus(inspection.status)}
                            </span>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="bg-muted/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Hygiene Score</p>
                            {editMode ? (
                                <span className={`text-2xl font-bold ${scoreColor(editData.score)}`}>{editData.score}/10</span>
                            ) : (
                                <span className={`text-2xl font-bold ${scoreColor(inspection.score)}`}>{inspection.score}/10</span>
                            )}
                        </div>
                        {editMode ? (
                            <input
                                type="range" min="1" max="10"
                                value={editData.score}
                                onChange={e => setEditData(d => ({ ...d, score: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        ) : (
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${inspection.score >= 7 ? 'bg-green-500' : inspection.score >= 4 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${inspection.score * 10}%` }}
                                />
                            </div>
                        )}
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Critical (1)</span><span>Excellent (10)</span>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Remarks</p>
                        {editMode ? (
                            <textarea
                                rows={4}
                                value={editData.remarks}
                                onChange={e => setEditData(d => ({ ...d, remarks: e.target.value }))}
                                className="flex w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                                placeholder="Inspector remarks..."
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 min-h-[60px]">
                                {inspection.remarks || <span className="italic">No remarks provided.</span>}
                            </p>
                        )}
                    </div>

                    {/* Photo */}
                    {inspection.images && inspection.images.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium flex items-center gap-1"><Image className="w-4 h-4" /> Photo Evidence</p>
                            <div className="grid grid-cols-2 gap-2">
                                {inspection.images.map((img, idx) => (
                                    <a key={idx} href={img.url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={img.url}
                                            alt={`Evidence ${idx + 1}`}
                                            className="w-full h-36 object-cover rounded-lg border hover:opacity-90 transition-opacity"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation */}
                    {confirmDelete && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                            <p className="text-sm font-semibold text-red-700">Delete this inspection record?</p>
                            <p className="text-xs text-red-600">This action cannot be undone. The record will be permanently removed.</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex-1 px-3 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-60 flex items-center justify-center"
                                >
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4 mr-1" /> Delete</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Edit Mode Footer */}
                {editMode && (
                    <div className="p-5 border-t bg-muted/20 flex justify-end space-x-3">
                        <button
                            onClick={() => { setEditMode(false); setEditData({ score: inspection.score, remarks: inspection.remarks || '' }); setError(''); }}
                            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center"
                        >
                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Main Page ─── */
const InspectionManagement = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [inspections, setInspections] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null); // inspection opened in modal

    useEffect(() => { fetchInspections(); }, []);

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

    const handleSaved = (updated) => {
        setInspections(prev => prev.map(i => i._id === updated._id ? updated : i));
        setSelected(updated);
    };

    const handleDeleted = (id) => {
        setInspections(prev => prev.filter(i => i._id !== id));
    };

    const filtered = inspections.filter(i =>
        (i.facilityId?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (i.inspectorId?.name || '').toLowerCase().includes(search.toLowerCase())
    );

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
                                <th scope="col" className="px-6 py-3">Score &amp; Status</th>
                                <th scope="col" className="px-6 py-3">Photo</th>
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
                                            <button
                                                onClick={() => setSelected(inspection)}
                                                className="text-xs text-primary flex items-center mt-1 hover:underline"
                                            >
                                                View details <ArrowUpRight className="w-3 h-3 ml-0.5" />
                                            </button>
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
                                        <td className="px-6 py-4">
                                            {inspection.images && inspection.images.length > 0 ? (
                                                <img
                                                    src={inspection.images[0].url}
                                                    alt="Evidence"
                                                    className="w-12 h-12 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => setSelected(inspection)}
                                                />
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">None</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t bg-muted/30 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Showing {filtered.length} of {inspections.length} entries</span>
                </div>
            </div>

            {/* Detail / Edit / Delete Modal */}
            {selected && (
                <InspectionModal
                    inspection={selected}
                    onClose={() => setSelected(null)}
                    onSaved={handleSaved}
                    onDeleted={handleDeleted}
                    isAdmin={isAdmin}
                    currentUser={user}
                />
            )}
        </div>
    );
};

export default InspectionManagement;
