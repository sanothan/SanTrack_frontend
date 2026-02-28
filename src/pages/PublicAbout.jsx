import React from 'react';
import { Target, Heart, Globe, Award } from 'lucide-react';

const PublicAbout = () => {
    return (
        <div className="bg-background flex-1">
            {/* Page Header */}
            <div className="bg-muted py-16 px-4 sm:px-6 lg:px-8 border-b text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">About SanTrack</h1>
                    <p className="text-xl text-muted-foreground">
                        We believe that clean water and proper sanitation are fundamental human rights. Our mission is to provide the digital infrastructure needed to maintain them.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold Tracking-tight mb-6">Our Story</h2>
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                In many rural and developing regions, sanitation facilities are built but quickly fall into disrepair due to a lack of coordinated maintenance and monitoring. Government officials and NGOs often rely on scattered paper records or verbal reports that get lost in the system.
                            </p>
                            <p>
                                <strong>SanTrack</strong> was born out of the necessity to digitize and streamline this process. By creating a unified platform, we bridge the gap between the facilities on the ground, the citizens who use them, the inspectors who check them, and the administrators who fund their repair.
                            </p>
                            <p>
                                Today, communities can actively participate in their own hygiene and health by reporting issues directly to the platform, ensuring faster response times and greater accountability.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-6 rounded-2xl text-center border border-blue-100 dark:bg-blue-900/10 dark:border-blue-800">
                            <Target className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Our Mission</h3>
                            <p className="text-sm text-muted-foreground">Ensure 100% functional sanitation access across registered villages.</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-2xl text-center border border-green-100 mt-8 dark:bg-green-900/10 dark:border-green-800">
                            <Globe className="w-10 h-10 text-green-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Our Vision</h3>
                            <p className="text-sm text-muted-foreground">A world where no community suffers from preventable waterborne diseases.</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-2xl text-center border border-amber-100 -mt-8 dark:bg-amber-900/10 dark:border-amber-800">
                            <Heart className="w-10 h-10 text-amber-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Core Values</h3>
                            <p className="text-sm text-muted-foreground">Transparency, Community Empowerment, and Accountability.</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl text-center border border-purple-100 dark:bg-purple-900/10 dark:border-purple-800">
                            <Award className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                            <h3 className="font-bold text-lg mb-2">Impact Goal</h3>
                            <p className="text-sm text-muted-foreground">Reduce repair turnaround times from months to days.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team/Contact placeholder */}
            <div className="bg-card border-y py-16 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-2xl font-bold">Partner With Us</h2>
                    <p className="text-muted-foreground text-lg">
                        Are you an NGO, local government, or community leader looking to implement SanTrack in your region? We'd love to hear from you.
                    </p>
                    <a href="mailto:partners@santrack.org" className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                        Contact Our Team
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PublicAbout;
