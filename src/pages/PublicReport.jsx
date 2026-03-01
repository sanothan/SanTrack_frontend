import React, { useState, useEffect } from 'react';
import { Camera, Save, XCircle, AlertTriangle, Building2, User, Phone, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { facilityService } from '../services/facilityService';
import { issueService } from '../services/issueService';
import { useAuth } from '../context/AuthContext';

const PublicReport = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [formData, setFormData] = useState({
        facilityId: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const data = await facilityService.getPublicFacilities();
                setFacilities(data);
            } catch (err) {
                console.error("Could not fetch facilities:", err);
            }
        };
        fetchFacilities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('You must be logged in to submit a report.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await issueService.createIssue(formData);
            setSuccess(true);
            setFormData({ facilityId: '', description: '' });

            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex items-center justify-center">
                <div className="bg-card border shadow-lg rounded-2xl p-8 text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
                    <p className="text-muted-foreground mb-6">
                        To maintain accountability and track the progress of your reports, you must be logged in to submit a sanitation issue.
                    </p>
                    <div className="flex flex-col space-y-3">
                        <Link
                            to="/login"
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                        >
                            Log In to Your Account
                        </Link>
                        <p className="text-sm">
                            Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up here</Link>
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-card border shadow-lg rounded-2xl overflow-hidden mt-4 md:mt-8">
                <div className="bg-blue-50 border-b border-blue-100 p-6 md:p-8 dark:bg-blue-950/20 dark:border-blue-900/30">
                    <AlertTriangle className="w-12 h-12 text-blue-600 mb-4 dark:text-blue-400" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Report a Sanitation Issue</h1>
                    <p className="text-muted-foreground text-lg">
                        Help us keep our community clean and safe. Report broken facilities, leaks, or hygiene concerns directly to the tracking system.
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    {success && (
                        <div className="mb-6 p-4 flex items-center bg-green-50 text-green-700 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                            <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold">Thank you!</h4>
                                <p className="text-sm">Your report has been successfully submitted to the authorities.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Facility Selection */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium flex items-center">
                                <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                                Which facility has an issue? <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                required
                                value={formData.facilityId}
                                onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                                className="flex h-12 w-full rounded-md border bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                            >
                                <option value="" disabled>-- Select a public facility --</option>
                                {facilities.map(f => (
                                    <option key={f._id} value={f._id}>{f.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Issue Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2 text-muted-foreground" />
                                Describe the problem <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                required
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Please provide details about what is broken, leaking, or needs attention..."
                                className="flex w-full rounded-md border bg-background px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y transition-shadow"
                            ></textarea>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-md disabled:opacity-70 flex items-center justify-center"
                            >
                                {loading ? 'Submitting Report...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>

                <button>Delete</button>
            </div>
        </main>
    );
};

export default PublicReport;
