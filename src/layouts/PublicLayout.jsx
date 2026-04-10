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
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-card/95 backdrop-blur border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                                <Droplet className="w-5 h-5" />
                            </div>
                            <Link to="/" className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
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
                                        "text-sm font-medium transition-colors pb-1 border-b-2 border-transparent",
                                        location.pathname === link.path ? "text-primary border-primary" : "text-muted-foreground hover:text-foreground"
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
                                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <User className="w-4 h-4 mr-1" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="bg-muted hover:bg-muted/80 text-foreground px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-border flex items-center"
                                    >
                                        <LogOut className="w-4 h-4 mr-1" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-card hover:bg-muted text-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border"
                                    >
                                        Sign Up
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-foreground hover:text-primary focus:outline-none"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-card pb-4 px-4 space-y-2 border-t pt-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium",
                                    location.pathname === link.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {link.title}
                            </Link>
                        ))}
                        <Link
                            to="/register"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 mt-4 rounded-md text-base font-medium bg-muted text-foreground border border-border text-center"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground text-center"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            <footer className="bg-card text-muted-foreground py-8 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Droplet className="w-5 h-5 text-primary" />
                                <span className="text-lg font-bold text-foreground">SanTrack</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Digital sanitation monitoring system empowering rural communities through transparent issue tracking and facility management.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                                <li><Link to="/report" className="hover:text-primary transition-colors">Report an Issue</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>support@santrack.org</li>
                                <li>+1 (555) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} SanTrack Public Sanitation Monitoring. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
