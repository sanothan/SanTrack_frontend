import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    MapPin,
    Building2,
    ClipboardCheck,
    AlertTriangle,
    Settings,
    Users
} from 'lucide-react';
import { cn } from '../utils/cn';

const Sidebar = ({ isOpen, setOpen }) => {
    const { user } = useAuth();
    const role = user?.role || 'community';

    const navItems = [
        { name: 'Dashboard', path: `/${role}`, icon: Home, roles: ['admin', 'inspector', 'community'] },
        { name: 'Users', path: `/${role}/users`, icon: Users, roles: ['admin'] },
        { name: 'Villages', path: `/${role}/villages`, icon: MapPin, roles: ['admin'] },
        { name: 'Facilities', path: `/${role}/facilities`, icon: Building2, roles: ['admin', 'inspector', 'community'] },
        { name: 'Inspections', path: `/${role}/inspections`, icon: ClipboardCheck, roles: ['admin', 'inspector'] },
        { name: 'Issues', path: `/${role}/issues`, icon: AlertTriangle, roles: ['admin', 'inspector', 'community'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(role));

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b">
                        <span className="text-xl font-bold text-primary">SanTrack</span>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {filteredItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) => cn(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t">
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => cn(
                                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Settings className="mr-3 h-5 w-5" />
                            Settings
                        </NavLink>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
