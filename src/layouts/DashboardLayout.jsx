import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col w-full min-w-0">
                <TopNav toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 overflow-y-auto w-full">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
