import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Droplet, Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'About Us', path: '/about' },
        { title: 'Contact Us', path: '/contact' },
        { title: 'Report Issue', path: '/report' }
    ];

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded bg-white text-primary flex items-center justify-center font-bold text-xl">
                                <Droplet className="w-5 h-5" />
                            </div>
                            <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-white/90">
                                SanTrack
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-white/80",
                                        location.pathname === link.path ? "text-white border-b-2 border-white pb-1" : "text-primary-foreground/80"
                                    )}
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </nav>

                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/profile"
                                        className="flex items-center text-sm font-medium hover:text-white/80 transition-colors"
                                    >
                                        <User className="w-4 h-4 mr-1" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-white/20 flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-1" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors border border-white/20"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white hover:text-white/80 focus:outline-none"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-primary pb-4 px-4 space-y-2 border-t border-primary-foreground/10 pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium",
                                    location.pathname === link.path ? "bg-white/10 text-white" : "text-primary-foreground/80 hover:bg-white/5"
                                )}
                            >
                                {link.title}
                            </Link>
                        ))}
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 mt-4 rounded-md text-base font-medium bg-white/10 text-white border border-white/20 text-center"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Droplet className="w-5 h-5 text-primary" />
                                <span className="text-lg font-bold text-white">SanTrack</span>
                            </div>
                            <p className="text-sm text-slate-400">
                                Digital sanitation monitoring system empowering rural communities through transparent issue tracking and facility management.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                                <li><Link to="/report" className="hover:text-primary transition-colors">Report an Issue</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>support@santrack.org</li>
                                <li>+1 (555) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} SanTrack Public Sanitation Monitoring. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
