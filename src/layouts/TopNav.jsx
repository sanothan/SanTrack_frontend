import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNav = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-muted focus:outline-none"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline-block font-medium">
                        {user?.name || 'User'}
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

export default TopNav;
