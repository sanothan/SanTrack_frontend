import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Droplet, Users, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicHome = () => {
    const { user } = useAuth();

    return (
        <div className="flex-1">
            {/* Hero Section */}
            <div className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b bg-gradient-to-b from-card to-muted/30">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
                    style={{
                        backgroundImage: "url('/welcome-bg.jpg'), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')"
                    }}
                ></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    {user?.name && (
                        <div className="mb-8">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                                Welcome, {user.name}! 👋
                            </h2>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Glad to see you back on SanTrack.
                            </p>
                        </div>
                    )}
                    <span className="inline-block py-1 px-3 rounded-md bg-primary/10 text-primary text-xs font-semibold tracking-[0.12em] uppercase mb-4 border border-primary/20">
                        RURAL SANITATION MONITORING
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6 mt-4">
                        Clean Water & Sanitation <br className="hidden md:block" /> for Every Village
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground mb-10">
                        SanTrack is a digital platform that empowers communities to report issues, tracks maintenance of public facilities, and ensures clean, safe sanitation and water access.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link to="/report" className="px-8 py-3.5 bg-primary text-primary-foreground rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            Report a Problem
                        </Link>
                        <Link to="/about" className="px-8 py-3.5 bg-card text-foreground rounded-md font-semibold text-lg hover:bg-muted border border-border transition-colors flex items-center hidden lg:flex">
                            Learn How It Works
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-foreground">Why We Built SanTrack</h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                            We are bridging the gap between rural communities and health authorities to solve real-world sanitation challenges through data and accountability.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="bg-card p-8 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Activity className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Real-Time Tracking</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Paper records get lost. We digitally track every toilet, well, and water point, updating its condition live via inspector routines.
                            </p>
                        </div>

                        <div className="bg-card p-8 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-accent/20 text-accent-foreground rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community Voices</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Don't wait for the next month's inspection. Citizens can directly report broken pipes or dirty facilities to alert authorities instantly.
                            </p>
                        </div>

                        <div className="bg-card p-8 rounded-xl shadow-sm border text-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Accountable Actions</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We measure improvement. Administrators hold contractors and maintenance teams accountable utilizing clear data and historical issue logs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-muted/40 border-t">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">See a broken water pipe in your village?</h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        You don't need an account. You just need to tell us where the problem is. Let's fix it together.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link to="/report" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                            File a Support Ticket <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicHome;
