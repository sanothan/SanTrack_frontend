import React, { useState, useEffect } from 'react';
import {
    Search, Activity, CalendarDays, Edit2, Trash2, X, Save,
    ArrowUpRight, CheckCircle, AlertCircle, Building2, User, Loader2, Image,
    TrendingUp, ClipboardCheck, ShieldAlert, Filter, ArrowRight, Info, Droplets, Wind, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { inspectionService } from '../services/inspectionService';

/* ─── Helpers ─── */
const getStatusStyle = (status) => {
    if (status === 'good') return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    if (status === 'needs_attention') return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
};
const formatStatus = (s) => (s || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
const scoreColor = (score) => score >= 7 ? 'text-emerald-500' : score >= 4 ? 'text-amber-500' : 'text-rose-500';

/* ─── Components ─── */
const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 ${colorClass}`}></div>
        <div className="flex items-start justify-between">
            <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-primary">{value}</h3>
                    {trend && <span className="text-[10px] font-bold text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">{trend}</span>}
                </div>
            </div>
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </div>
);

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
        cleanlinessLevel: inspection.cleanlinessLevel || 'good',
        odorLevel: inspection.odorLevel || 'none',
        waterAvailability: inspection.waterAvailability || 'full',
        suppliesStatus: inspection.suppliesStatus || 'stocked',
        maintenanceRequired: !!inspection.maintenanceRequired,
    });

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const updated = await inspectionService.updateInspection(inspection._id, {
                score: Number(editData.score),
                remarks: editData.remarks,
                cleanlinessLevel: editData.cleanlinessLevel,
                odorLevel: editData.odorLevel,
                waterAvailability: editData.waterAvailability,
                suppliesStatus: editData.suppliesStatus,
                maintenanceRequired: editData.maintenanceRequired,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="bg-card glass-effect border rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-muted/5">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Inspection Profile</h2>
                        <p className="text-xs text-muted-foreground">ID: #{inspection._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {canManage && !editMode && (
                            <div className="flex bg-muted/30 p-1 rounded-xl">
                                <button
                                    onClick={() => { setEditMode(true); setConfirmDelete(false); setError(''); }}
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-background rounded-lg transition-all shadow-sm"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setConfirmDelete(true); setEditMode(false); setError(''); }}
                                    className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-background rounded-lg transition-all shadow-sm"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 mr-3 shrink-0" />{error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Left Column: Visuals & Core Info */}
                        <div className="md:col-span-5 space-y-6">
                            {/* Score Gauge */}
                            <div className="relative aspect-square rounded-3xl bg-muted/10 border-2 border-dashed flex items-center justify-center flex-col overflow-hidden group">
                                <div className={`absolute inset-0 opacity-10 blur-2xl ${inspection.score >= 7 ? 'bg-emerald-500' : inspection.score >= 4 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                <div className="relative z-10 flex flex-col items-center">
                                    <span className={`text-6xl font-bold ${scoreColor(editMode ? editData.score : inspection.score)}`}>
                                        {editMode ? editData.score : inspection.score}
                                    </span>
                                    <span className="text-sm font-bold opacity-50 uppercase tracking-tighter">Hygiene Rating</span>
                                </div>
                                {editMode && (
                                    <div className="absolute inset-x-6 bottom-6 animate-in fade-in slide-in-from-bottom-2">
                                        <input
                                            type="range" min="1" max="10"
                                            value={editData.score}
                                            onChange={e => setEditData(d => ({ ...d, score: parseInt(e.target.value) }))}
                                            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Images */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Image className="w-3.5 h-3.5" /> Evidence Gallery
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {inspection.images && inspection.images.length > 0 ? (
                                        inspection.images.map((img, idx) => (
                                            <a key={idx} href={img.url} target="_blank" rel="noopener noreferrer" className="group relative rounded-2xl overflow-hidden border aspect-video block">
                                                <img src={img.url} alt="Evidence" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                            </a>
                                        ))
                                    ) : (
                                        <div className="col-span-2 h-24 bg-muted/10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                            <Info className="w-5 h-5 mb-1" />
                                            <span className="text-[10px] font-bold uppercase">No Photo Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Details & Forms */}
                        <div className="md:col-span-7 space-y-6">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                <div className="space-y-1 col-span-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <Building2 className="w-3 h-3 text-primary" /> Facility Context
                                    </p>
                                    <p className="text-lg font-bold leading-tight">{inspection.facilityId?.name || 'Unknown'}</p>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{inspection.facilityId?.type || 'Standard'}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                        <User className="w-3 h-3 text-primary" /> Logged By
                                    </p>
                                    <p className="text-sm font-semibold truncate leading-none pt-1">{inspection.inspectorId?.name || 'N/A'}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 justify-end">
                                        <CalendarDays className="w-3 h-3 text-primary" /> Timestamp
                                    </p>
                                    <p className="text-sm font-semibold pt-1 leading-none">{new Date(inspection.date || inspection.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                </div>
                            </div>

                            {/* Detailed Metrics */}
                            <div className="bg-muted/10 border rounded-3xl p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detailed Assessment</p>
                                    {!editMode && inspection.maintenanceRequired && (
                                        <span className="bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase px-2 py-1 rounded-md animate-pulse">Attention Required</span>
                                    )}
                                </div>

                                {editMode ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Droplets className="w-3 h-3" /> Cleanliness</label>
                                            <select
                                                value={editData.cleanlinessLevel}
                                                onChange={e => setEditData(d => ({ ...d, cleanlinessLevel: e.target.value }))}
                                                className="w-full text-xs bg-background border rounded-xl p-2 focus:ring-2 focus:ring-primary appearance-none"
                                            >
                                                <option value="excellent">Excellent</option>
                                                <option value="good">Good</option>
                                                <option value="average">Average</option>
                                                <option value="poor">Poor</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Wind className="w-3 h-3" /> Odor Level</label>
                                            <select
                                                value={editData.odorLevel}
                                                onChange={e => setEditData(d => ({ ...d, odorLevel: e.target.value }))}
                                                className="w-full text-xs bg-background border rounded-xl p-2 focus:ring-2 focus:ring-primary appearance-none"
                                            >
                                                <option value="none">None</option>
                                                <option value="low">Low</option>
                                                <option value="moderate">Moderate</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><ClipboardCheck className="w-3 h-3" /> Water</label>
                                            <select
                                                value={editData.waterAvailability}
                                                onChange={e => setEditData(d => ({ ...d, waterAvailability: e.target.value }))}
                                                className="w-full text-xs bg-background border rounded-xl p-2 focus:ring-2 focus:ring-primary appearance-none"
                                            >
                                                <option value="full">Full</option>
                                                <option value="partial">Partial</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Package className="w-3 h-3" /> Supplies</label>
                                            <select
                                                value={editData.suppliesStatus}
                                                onChange={e => setEditData(d => ({ ...d, suppliesStatus: e.target.value }))}
                                                className="w-full text-xs bg-background border rounded-xl p-2 focus:ring-2 focus:ring-primary appearance-none"
                                            >
                                                <option value="stocked">Stocked</option>
                                                <option value="low">Low</option>
                                                <option value="out_of_stock">Out</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 p-3 bg-muted/20 rounded-2xl flex items-center justify-between group cursor-pointer" onClick={() => setEditData(d => ({ ...d, maintenanceRequired: !d.maintenanceRequired }))}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg transition-colors ${editData.maintenanceRequired ? 'bg-rose-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                                                    <AlertCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wide">Maintenance Trigger</span>
                                            </div>
                                            <div className={`w-8 h-4 rounded-full relative transition-colors ${editData.maintenanceRequired ? 'bg-rose-500' : 'bg-muted'}`}>
                                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${editData.maintenanceRequired ? 'right-0.5' : 'left-0.5'}`} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Cleanliness', val: inspection.cleanlinessLevel, icon: Droplets, color: 'text-sky-500' },
                                            { label: 'Odor Level', val: inspection.odorLevel, icon: Wind, color: 'text-amber-500' },
                                            { label: 'Hydration', val: inspection.waterAvailability, icon: Droplets, color: 'text-blue-500' },
                                            { label: 'Supplies', val: formatStatus(inspection.suppliesStatus), icon: Package, color: 'text-emerald-500' }
                                        ].map((m, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-background border rounded-2xl">
                                                <div className={`p-2 rounded-xl bg-muted/30 ${m.color}`}>
                                                    <m.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase text-muted-foreground leading-none mb-1">{m.label}</p>
                                                    <p className="text-xs font-bold leading-none capitalize">{m.val || 'Good'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Remarks */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Activity className="w-3 h-3 text-primary" /> Inspector Log
                                </p>
                                {editMode ? (
                                    <textarea
                                        rows={3}
                                        value={editData.remarks}
                                        onChange={e => setEditData(d => ({ ...d, remarks: e.target.value }))}
                                        className="flex w-full rounded-2xl border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="Enter observations..."
                                    />
                                ) : (
                                    <div className="relative">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 rounded-full"></div>
                                        <p className="text-sm italic pl-4 text-muted-foreground leading-relaxed">
                                            "{inspection.remarks || 'Standard observations recorded during field visit.'}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delete Confirmation Overlay */}
                    {confirmDelete && (
                        <div className="mt-8 p-6 bg-rose-500/10 border-2 border-dashed border-rose-500/30 rounded-[2rem] flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
                            <div className="p-4 bg-rose-500 text-white rounded-full shadow-lg shadow-rose-500/30">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-rose-500 mb-1 leading-none uppercase tracking-tighter">Confirm Destruction</p>
                                <p className="text-xs text-rose-600/80 font-medium">This report will be permanently erased from SanTrack archives.</p>
                            </div>
                            <div className="flex gap-3 w-full max-w-xs">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex-1 px-4 py-2 bg-white border border-rose-200 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center transition-all"
                                >
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {editMode && (
                    <div className="p-6 border-t bg-muted/5 flex justify-end gap-3 backdrop-blur-sm">
                        <button
                            onClick={() => { setEditMode(false); setEditData({ score: inspection.score, remarks: inspection.remarks || '', cleanlinessLevel: inspection.cleanlinessLevel || 'good', odorLevel: inspection.odorLevel || 'none', waterAvailability: inspection.waterAvailability || 'full', suppliesStatus: inspection.suppliesStatus || 'stocked', maintenanceRequired: !!inspection.maintenanceRequired }); setError(''); }}
                            className="px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-2.5 bg-primary text-primary-foreground rounded-2xl text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                            {saving ? 'Syncing...' : 'Save Changes'}
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
    const [selected, setSelected] = useState(null);

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

    // Derived stats
    const avgScore = inspections.length ? (inspections.reduce((a, b) => a + b.score, 0) / inspections.length).toFixed(1) : '0';
    const criticalCount = inspections.filter(i => i.status === 'critical').length;
    const maintenanceRequiredCount = inspections.filter(i => i.maintenanceRequired).length;

    return (
        <div className="space-y-8 pb-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Title & Breadcrumbs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Intelligence Hub</h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-70">SanTrack Oversight & Analysis</p>
                </div>
                <div className="flex bg-muted/30 p-1.5 rounded-2xl items-center gap-4 px-4 border">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">System Status</span>
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Operational
                        </span>
                    </div>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Reports"
                    value={inspections.length}
                    icon={ClipboardCheck}
                    colorClass="bg-primary"
                    trend="+12%"
                />
                <StatCard
                    title="Avg Hygiene"
                    value={`${avgScore}/10`}
                    icon={TrendingUp}
                    colorClass="bg-emerald-500"
                />
                <StatCard
                    title="Critical Zones"
                    value={criticalCount}
                    icon={ShieldAlert}
                    colorClass="bg-rose-500"
                />
                <StatCard
                    title="Maintenance Req."
                    value={maintenanceRequiredCount}
                    icon={AlertCircle}
                    colorClass="bg-amber-500"
                />
            </div>

            {/* Main Content Area */}
            <div className="bg-card glass-effect border rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden">
                <div className="p-8 border-b bg-muted/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Filter className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight text-primary">Inspection Ledger</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Verified Field Data</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Locate report..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 w-full rounded-2xl border bg-muted/20 pl-11 pr-4 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all focus:bg-background outline-none shadow-inner"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Period</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Location</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Field Agent</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Integrity Index</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">Attachment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted/10">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6"><div className="h-10 bg-muted/20 rounded-2xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center flex flex-col items-center">
                                        <Info className="w-12 h-12 text-muted-foreground/20 mb-4" />
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No matching records found</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((inspection) => (
                                    <tr
                                        key={inspection._id}
                                        className="group hover:bg-muted/40 transition-all cursor-pointer relative"
                                        onClick={() => setSelected(inspection)}
                                    >
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-tighter">{new Date(inspection.date || inspection.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground leading-none">{new Date(inspection.date || inspection.createdAt).getFullYear()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col max-w-[200px]">
                                                <div className="font-bold text-sm tracking-tight text-foreground truncate group-hover:text-primary transition-colors">{inspection.facilityId?.name || 'Sanitary Facility'}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{inspection.facilityId?.type || 'Standard'}</span>
                                                    <div className="w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
                                                    <div className="flex items-center text-[9px] font-bold uppercase text-sky-500">
                                                        {inspection.cleanlinessLevel || 'Verified'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                                    {inspection.inspectorId?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold leading-none">{inspection.inspectorId?.name || 'Agent'}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[120px]">{inspection.inspectorId?.role || 'Inspector'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col gap-1.5 w-full max-w-[100px]">
                                                    <div className="flex justify-between items-end">
                                                        <span className={`text-lg font-bold leading-none ${scoreColor(inspection.score)}`}>{inspection.score}</span>
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Rate</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-700 ease-out rounded-full ${inspection.score >= 7 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : inspection.score >= 4 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                            style={{ width: `${inspection.score * 10}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                {inspection.maintenanceRequired && (
                                                    <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg animate-pulse" title="Immediate Attention Required">
                                                        <AlertCircle className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex justify-center">
                                                {inspection.images && inspection.images.length > 0 ? (
                                                    <div className="relative group/img overflow-hidden rounded-xl border-2 border-background shadow-sm hover:ring-2 hover:ring-primary h-12 w-12 transition-all">
                                                        <img src={inspection.images[0].url} alt="Ev." className="w-full h-full object-cover group-hover/img:scale-125 transition-transform" />
                                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center">
                                                            <ArrowRight className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-muted/10 border-2 border-dashed flex items-center justify-center opacity-30">
                                                        <Image className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
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
