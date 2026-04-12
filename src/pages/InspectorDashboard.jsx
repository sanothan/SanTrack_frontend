import React, { useState, useEffect } from 'react';
import {
    Building2,
    ClipboardCheck,
    AlertTriangle,
    CalendarCheck,
    LayoutDashboard,
    ArrowRight,
    History,
    Zap,
    Clock,
    MapPin,
    Calendar,
    Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scheduleService } from '../services/scheduleService';
import { inspectionService } from '../services/inspectionService';

const StatCell = ({ icon: Icon, label, value, color, trend }) => (
    <div className="glass-effect border rounded-[2.5rem] p-8 space-y-4 group hover:scale-[1.02] transition-all duration-500 border-white/40 shadow-2xl shadow-primary/5 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 ${color}`}></div>
        <div className="flex justify-between items-start relative z-10">
            <div className={`p-4 rounded-2xl ${color.replace('bg-', 'text-').replace('-500', '')} bg-muted/20 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <div className="text-[10px] font-black tracking-widest uppercase italic opacity-40">
                    {trend}
                </div>
            )}
        </div>
        <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">{label}</p>
            <h3 className="text-3xl font-bold tracking-tight text-primary">{value}</h3>
        </div>
    </div>
);

const InspectorDashboard = () => {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncHistory, setSyncHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setHistoryLoading(true);
            try {
                const [schedulesResult, historyResult] = await Promise.allSettled([
                    scheduleService.getSchedules(),
                    inspectionService.getSyncHistory({ limit: 5 })
                ]);

                if (schedulesResult.status === 'fulfilled') {
                    setSchedules(schedulesResult.value.filter(s => s.status === 'pending').slice(0, 3));
                } else {
                    setSchedules([]);
                    console.error(schedulesResult.reason);
                }

                if (historyResult.status === 'fulfilled') {
                    setSyncHistory(historyResult.value.items || []);
                } else {
                    setSyncHistory([]);
                    console.error(historyResult.reason);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                setHistoryLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statusTone = (status) => {
        if (status === 'critical') return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        if (status === 'needs_attention') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    };

    const issueTone = (status) => {
        if (status === 'resolved') return 'text-emerald-500';
        if (status === 'in_progress') return 'text-amber-500';
        return 'text-rose-500';
    };

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <LayoutDashboard className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-primary">Command Center</h1>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground tracking-wide opacity-70 pl-16">Tactical Overview // Welcome back, {user?.name || 'Inspector'}</p>
                </div>

                <Link to="/inspector/inspections/new" className="h-14 px-8 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-2xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group">
                    <Zap className="w-5 h-5 fill-current" /> Initialize Audit
                </Link>
            </div>

            {/* Intelligence Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCell
                    icon={Building2}
                    label="Operations Scope"
                    value="12"
                    color="bg-azure-500"
                    trend="Active Nodes"
                />
                <StatCell
                    icon={CalendarCheck}
                    label="Pending Cycles"
                    value={loading ? ".." : schedules.length.toString().padStart(2, '0')}
                    color="bg-amber-500"
                    trend="Next 48H"
                />
                <StatCell
                    icon={AlertTriangle}
                    label="System Alerts"
                    value="03"
                    color="bg-rose-500"
                    trend="Priority High"
                />
            </div>

            {/* Operational Layout */}
            <div className="grid lg:grid-cols-5 gap-8">
                {/* Tactical Schedule */}
                <div className="lg:col-span-3 glass-effect border rounded-[3.5rem] overflow-hidden border-white/40 shadow-2xl shadow-primary/5">
                    <div className="p-10 border-b border-white/20 flex justify-between items-center bg-muted/5">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                                <History className="w-6 h-6 text-primary" /> Mission Schedule
                            </h2>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Log of upcoming tactical assessments</p>
                        </div>
                        <Link to="/inspector/schedule" className="p-3 bg-muted/20 hover:bg-primary/10 rounded-2xl transition-all group">
                            <Calendar className="w-5 h-5 text-primary" />
                        </Link>
                    </div>

                    <div className="p-10 space-y-4">
                        {loading ? (
                            <div className="py-12 flex justify-center"><Loader2 className="animate-spin opacity-20" /></div>
                        ) : schedules.length > 0 ? (
                            schedules.map(sched => (
                                <div key={sched._id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3 rounded-2xl ${sched.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                            sched.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-azure-500/10 text-azure-500'
                                            }`}>
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm tracking-tight italic uppercase">{sched.facilityId?.name || 'Unit Alpha'}</h4>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {sched.facilityId?.villageId?.name || 'Zone'}</span>
                                                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                                <span>{new Date(sched.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/inspector/inspections/new?facility=${sched.facilityId?._id}&schedule=${sched._id}`} className="p-3 bg-primary/10 text-primary rounded-xl opacity-0 group-hover:opacity-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                        Deploy <Zap className="w-3 h-3 fill-current" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center space-y-6">
                                <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto opacity-30">
                                    <CalendarCheck className="w-10 h-10" />
                                </div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">
                                    No operational tasks detected for current cycle.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audit Sync History */}
                <div className="lg:col-span-2 glass-effect border rounded-[3.5rem] overflow-hidden border-white/40 shadow-2xl shadow-primary/5">
                    <div className="p-10 border-b border-white/20 flex justify-between items-center bg-muted/5">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3 text-emerald-500">
                                <ClipboardCheck className="w-6 h-6" /> Sync History
                            </h2>
                        </div>
                        <Link to="/inspector/inspections" className="p-3 bg-muted/20 hover:bg-primary/10 rounded-2xl transition-all group">
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="p-8 space-y-3">
                        {historyLoading ? (
                            <div className="py-10 flex justify-center">
                                <Loader2 className="animate-spin opacity-30" />
                            </div>
                        ) : syncHistory.length > 0 ? (
                            syncHistory.map((item) => (
                                <div key={item.inspection._id} className="rounded-2xl border border-white/20 bg-white/5 p-4 space-y-2.5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-wider leading-tight">
                                                {item.inspection.facilityId?.name || 'Facility'}
                                            </p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                                                {new Date(item.inspection.date || item.inspection.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${statusTone(item.inspection.status)}`}>
                                            {item.inspection.status?.replace('_', ' ') || 'good'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                                        <span className="text-muted-foreground">Score</span>
                                        <span className="text-primary">{item.inspection.score}/10</span>
                                    </div>

                                    {item.followUp?.issue && (
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-muted-foreground">Issue</span>
                                            <span className={issueTone(item.followUp.issue.status)}>{item.followUp.issue.status.replace('_', ' ')}</span>
                                        </div>
                                    )}

                                    {item.followUp?.schedule && (
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-muted-foreground">Follow-Up</span>
                                            <span className={item.followUp.schedule.isOverdue ? 'text-rose-500' : 'text-amber-500'}>
                                                {item.followUp.schedule.isOverdue ? 'Overdue' : new Date(item.followUp.schedule.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center space-y-4">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">
                                    No recent inspection activity.
                                </p>
                                <Link to="/inspector/inspections" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-4 transition-all pb-1 border-b-2 border-primary/20">
                                    Access Global Archives
                                </Link>
                            </div>
                        )}

                        {!historyLoading && syncHistory.length > 0 && (
                            <div className="pt-2 text-center">
                                <Link to="/inspector/inspections" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-4 transition-all pb-1 border-b-2 border-primary/20">
                                    Access Global Archives
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectorDashboard;
