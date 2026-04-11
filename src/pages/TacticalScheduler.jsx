import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    MapPin,
    AlertCircle,
    CheckCircle2,
    MoreVertical,
    Zap,
    Building2,
    X,
    Trash2,
    Loader2
} from 'lucide-react';
import { scheduleService } from '../services/scheduleService';
import { facilityService } from '../services/facilityService';
import { Link } from 'react-router-dom';

const TacticalScheduler = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newSchedule, setNewSchedule] = useState({
        facilityId: '',
        priority: 'medium',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedRes, facRes] = await Promise.all([
                scheduleService.getSchedules(),
                facilityService.getFacilities()
            ]);
            setSchedules(schedRes);
            setFacilities(facRes);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDateClick = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(date);
        setShowAddModal(true);
    };

    const handleCreateSchedule = async (e) => {
        e.preventDefault();
        try {
            await scheduleService.createSchedule({
                ...newSchedule,
                scheduledDate: selectedDate
            });
            setShowAddModal(false);
            setNewSchedule({ facilityId: '', priority: 'medium', notes: '' });
            fetchData();
        } catch (error) {
            console.error("Failed to create schedule", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Abort this mission?")) {
            try {
                await scheduleService.deleteSchedule(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete schedule", error);
            }
        }
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const calendarCells = [];

        // Padding for previous month
        for (let i = 0; i < startDay; i++) {
            calendarCells.push(<div key={`pad-${i}`} className="h-32 border border-white/5 opacity-20"></div>);
        }

        // Days of current month
        for (let day = 1; day <= days; day++) {
            const dateStr = new Date(year, month, day).toDateString();
            const daySchedules = schedules.filter(s => new Date(s.scheduledDate).toDateString() === dateStr);
            const isToday = new Date().toDateString() === dateStr;

            calendarCells.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-40 border border-white/10 p-4 transition-all hover:bg-white/5 cursor-pointer relative group ${isToday ? 'bg-primary/5' : ''}`}
                >
                    <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-muted-foreground opacity-50'}`}>
                        {day.toString().padStart(2, '0')}
                    </span>

                    <div className="mt-3 space-y-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                        {daySchedules.map((sched, idx) => (
                            <div
                                key={sched._id}
                                className={`text-[10px] p-2 rounded-xl border flex flex-col gap-1 transition-all hover:scale-105 ${sched.priority === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                    sched.priority === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                        'bg-azure-500/10 border-azure-500/20 text-azure-500'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-black truncate max-w-[80px]">{(sched.facilityId?.name || 'Unit').toUpperCase()}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${sched.priority === 'high' ? 'bg-rose-500' :
                                        sched.priority === 'medium' ? 'bg-amber-500' :
                                            'bg-azure-500'
                                        }`}></div>
                                </div>
                                <span className="opacity-60 truncate font-bold uppercase tracking-tighter">{sched.facilityId?.villageId?.name || 'Unknown'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return calendarCells;
    };

    if (loading && schedules.length === 0) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin opacity-20" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <CalendarIcon className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Tactical Ops Scheduler</h1>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground tracking-wide opacity-70 pl-16 uppercase">Mission Deployment Ledger // {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
                </div>

                <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-[2rem] border border-white/10">
                    <button onClick={prevMonth} className="p-3 hover:bg-primary/10 rounded-full transition-all text-primary">
                        <ChevronLeft />
                    </button>
                    <span className="text-sm font-bold uppercase tracking-widest px-4">{monthNames[currentDate.getMonth()]}</span>
                    <button onClick={nextMonth} className="p-3 hover:bg-primary/10 rounded-full transition-all text-primary">
                        <ChevronRight />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="glass-effect border rounded-[3rem] overflow-hidden border-white/20 shadow-2xl">
                <div className="grid grid-cols-7 border-b border-white/10 bg-muted/5">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 min-h-[600px]">
                    {renderCalendar()}
                </div>
            </div>

            {/* Legend / Stats */}
            <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/5 border border-rose-500/10 rounded-full">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase text-rose-500 tracking-widest">Priority High</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-full">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase text-amber-500 tracking-widest">Priority Medium</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-azure-500/5 border border-azure-500/10 rounded-full">
                    <div className="w-2 h-2 bg-azure-500 rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase text-azure-500 tracking-widest">Priority Low</span>
                </div>
            </div>

            {/* Add Mission Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-effect w-full max-w-md border border-white/40 rounded-[3.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold tracking-tight text-primary">Assign Mission</h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{selectedDate?.toDateString()}</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted/50 rounded-full transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSchedule} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Target Facility</label>
                                <select
                                    required
                                    value={newSchedule.facilityId}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, facilityId: e.target.value })}
                                    className="w-full h-14 bg-muted/20 border-2 border-white/10 rounded-2xl px-6 font-bold text-sm focus:border-primary/50 transition-all outline-none appearance-none"
                                >
                                    <option value="">Select Facility</option>
                                    {facilities.map(f => (
                                        <option key={f._id} value={f._id}>{f.name} ({f.villageId?.name})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Threat Level (Priority)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['low', 'medium', 'high'].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setNewSchedule({ ...newSchedule, priority: p })}
                                            className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newSchedule.priority === p
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-muted/10 border-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Operational Notes</label>
                                <textarea
                                    value={newSchedule.notes}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                                    placeholder="Enter mission objectives..."
                                    className="w-full h-32 bg-muted/20 border-2 border-white/10 rounded-3xl p-6 font-bold text-sm focus:border-primary/50 transition-all outline-none resize-none"
                                />
                            </div>

                            <button type="submit" className="w-full h-16 bg-primary text-white rounded-[2rem] font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                <Zap className="w-5 h-5 fill-current" /> Confirm Deployment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TacticalScheduler;
