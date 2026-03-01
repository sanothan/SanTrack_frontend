import React, { useEffect, useState } from 'react';
import {
    Building2,
    ClipboardCheck,
    AlertTriangle,
    Plus,
    CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InspectorDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Inspector Portal</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name || 'Inspector'}. Here are your pending tasks.</p>
                </div>
                <div className="flex space-x-2">
                    <Link to="/inspector/inspections/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary/90">
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        New Inspection
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Assigned Facilities</p>
                        <h3 className="text-2xl font-bold">12</h3>
                    </div>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center space-x-4">
                    <div className="p-3 bg-amber-100 text-amber-700 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                        <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Inspections</p>
                        <h3 className="text-2xl font-bold">5</h3>
                    </div>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center space-x-4">
                    <div className="p-3 bg-red-100 text-red-700 rounded-full dark:bg-red-900/30 dark:text-red-400">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">My Reported Issues</p>
                        <h3 className="text-2xl font-bold">3</h3>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                        <h2 className="font-semibold">My Schedule</h2>
                    </div>
                    <div className="p-6 text-center text-muted-foreground py-12">
                        No pending schedules for this week.
                    </div>
                </div>
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                        <h2 className="font-semibold">Recent Inspections</h2>
                        <Link to="/inspector/inspections" className="text-sm text-primary hover:underline">View all</Link>
                    </div>
                    <div className="p-6 text-center text-muted-foreground py-12">
                        No recent logs.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectorDashboard;
