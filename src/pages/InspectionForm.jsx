import React, { useState } from 'react';
import { Camera, Save, XCircle, CheckCircle } from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { facilityService } from '../services/facilityService';
import { useNavigate } from 'react-router-dom';

const InspectionForm = () => {
    const [formData, setFormData] = useState({
        facilityId: '',
        score: 5,
        remarks: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        const loadFacilities = async () => {
            try {
                const data = await facilityService.getFacilities();
                setFacilities(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadFacilities();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Determine status based on score
            let status = 'good';
            if (formData.score < 4) status = 'critical';
            else if (formData.score < 7) status = 'needs_attention';

            const payload = {
                ...formData,
                status,
            };

            if (imagePreview) {
                payload.images = [imagePreview];
            }

            await inspectionService.createInspection(payload);
            setSuccess(true);
            setFormData({ facilityId: '', score: 5, remarks: '' });
            setImagePreview(null);
            setTimeout(() => {
                setSuccess(false);
                navigate('/inspector');
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">New Inspection</h1>
                <p className="text-muted-foreground">Record hygiene metrics and facility condition.</p>
            </div>

            {success && (
                <div className="p-4 flex items-center bg-green-50 text-green-700 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Inspection record submitted successfully.
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Facility</label>
                        <select
                            required
                            value={formData.facilityId}
                            onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        >
                            <option value="">-- Choose a facility --</option>
                            {facilities.map(f => (
                                <option key={f._id} value={f._id}>{f.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Hygiene Score</label>
                            <span className={`text-xl font-bold ${formData.score >= 7 ? 'text-green-600' : formData.score >= 4 ? 'text-amber-500' : 'text-red-600'}`}>
                                {formData.score}/10
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1" max="10"
                            value={formData.score}
                            onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Critical (1)</span>
                            <span>Excellent (10)</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Inspector Remarks</label>
                        <textarea
                            rows="4"
                            required
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            className="flex w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y"
                            placeholder="Describe the current condition, any damages, or maintenance required..."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Photo Evidence</label>
                        <div className="flex items-center justify-center w-full">
                            {imagePreview ? (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                                    <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 border-muted-foreground/30 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                                        <Camera className="w-8 h-8 mb-3" />
                                        <p className="text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-muted/10 flex justify-end space-x-3">
                    <button type="button" className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium text-sm flex items-center shadow-sm hover:bg-primary/90 disabled:opacity-70 transition-colors"
                    >
                        {loading ? 'Submitting...' : <><Save className="w-4 h-4 mr-2" /> Save Form</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InspectionForm;
