import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const PublicContact = () => {
    return (
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            <div className="bg-card border shadow-lg rounded-2xl overflow-hidden mt-4 md:mt-8">
                {/* Header Block */}
                <div className="bg-primary/5 border-b p-8 md:p-12 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">Contact Us</h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                        We're here to help. Reach out to the SanTrack administrative team for inquiries, partnership opportunities, or support.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x border-b">
                    {/* Contact Information */}
                    <div className="p-8 md:p-12 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                            <p className="text-muted-foreground mb-8">
                                Whether you have a question about the platform, need to report an emergency sanitation issue directly to an administrator, or want to deploy SanTrack in your region, our team is ready to answer all your questions.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Our Location</h3>
                                    <p className="text-muted-foreground mt-1">
                                        SLIIT Malabe Campus, <br />
                                        New Kandy Road, <br />
                                        Malabe 10115, Sri Lanka
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Phone</h3>
                                    <p className="text-muted-foreground mt-1">
                                        +94 11 241 3900 <br />
                                        Mon-Fri from 8:30am to 5:00pm
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Email</h3>
                                    <p className="text-muted-foreground mt-1">
                                        support@santrack.org<br />
                                        hello@santrack.org
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Working Hours</h3>
                                    <p className="text-muted-foreground mt-1">
                                        Monday - Friday: 08:30 AM - 05:00 PM<br />
                                        Closed on Weekends and Public Holidays
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Interface */}
                    <div className="p-0 bg-muted/20 relative min-h-[400px]">
                        <iframe
                            src="https://maps.google.com/maps?q=SLIIT%20Malabe%20Campus&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="SLIIT Malabe Campus Map"
                            className="bg-muted"
                        ></iframe>
                    </div>
                </div>

                {/* Small CTA */}
                <div className="p-8 text-center bg-card">
                    <p className="text-muted-foreground font-medium">Looking to report a sanitation issue affecting your area?</p>
                    <a href="/report" className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 transition-colors">
                        Go to Report Platform
                    </a>
                </div>
            </div>
        </main>
    );
};

export default PublicContact;
