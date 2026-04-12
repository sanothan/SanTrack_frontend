import React, { useState, useEffect } from 'react';
import {
    Camera, Save, XCircle, CheckCircle, Loader2, AlertCircle,
    Building2, MapPin, ClipboardCheck, Info, Droplets, Wind, Package,
    ArrowRight, ArrowLeft, Image as ImageIcon, Activity
} from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { facilityService } from '../services/facilityService';
import { villageService } from '../services/villageService';
import { useNavigate, useLocation } from 'react-router-dom';
import { scheduleService } from '../services/scheduleService';
import api from '../services/api';

const InspectionForm = () => {
    const [formData, setFormData] = useState({
        facilityId: '',
        score: 5,
        remarks: '',
        cleanlinessLevel: 'good',
        odorLevel: 'none',
        waterAvailability: 'full',
        suppliesStatus: 'stocked',
        maintenanceRequired: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null); // { url, publicId }
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [villages, setVillages] = useState([]);
    const [selectedVillageId, setSelectedVillageId] = useState('');
    const [facilities, setFacilities] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Only load villages initially
                const villageData = await villageService.getVillages();
                setVillages(villageData);

                // Handle pre-filled facility from query param
                const queryParams = new URLSearchParams(location.search);
                const prefilledFacilityId = queryParams.get('facility');

                if (prefilledFacilityId) {
                    const facDetails = await facilityService.getFacilityById(prefilledFacilityId);
                    if (facDetails) {
                        const villageId = facDetails.villageId?._id || facDetails.villageId;
                        setSelectedVillageId(villageId);

                        // Load other facilities for this village
                        const facList = await facilityService.getFacilities({ villageId });
                        setFacilities(facList);

                        // Set the actual facility
                        setFormData(prev => ({ ...prev, facilityId: prefilledFacilityId }));
                    }
                }
            } catch (err) {
                console.error("Error loading initial data:", err);
            }
        };
        loadInitialData();
    }, [location.search]);

    const handleVillageChange = async (villageId) => {
        setSelectedVillageId(villageId);
        setFormData({ ...formData, facilityId: '' }); // Reset facility selection
        setFacilities([]); // Clear current facilities

        if (!villageId) return;

        try {
            setLoading(true);
            const data = await facilityService.getFacilities({ villageId });
            setFacilities(data);
        } catch (err) {
            console.error("Error loading facilities:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Local preview while uploading
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setImageFile(file);
        setUploadError('');
        setUploadedImage(null);

        // Upload to backend immediately
        setUploading(true);
        try {
            const formPayload = new FormData();
            formPayload.append('image', file);

            const response = await api.post('/uploads/image', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUploadedImage({ url: response.data.url, publicId: response.data.publicId });
            // Replace local preview with Cloudinary URL
            setImagePreview(response.data.url);
        } catch (err) {
            const msg = err.response?.data?.message || 'Image upload failed. Try again.';
            setUploadError(msg);
            setImagePreview(null);
            setImageFile(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        setUploadedImage(null);
        setUploadError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) return; // wait until upload is done

        setLoading(true);
        try {
            let status = 'good';
            if (formData.score < 4) status = 'critical';
            else if (formData.score < 7) status = 'needs_attention';

            const payload = {
                ...formData,
                status,
                images: uploadedImage ? [uploadedImage] : [],
            };

            await inspectionService.createInspection(payload);

            // Mark schedule as completed if it exists
            const queryParams = new URLSearchParams(location.search);
            const scheduleId = queryParams.get('schedule');
            if (scheduleId) {
                try {
                    await scheduleService.updateSchedule(scheduleId, { status: 'completed' });
                } catch (err) {
                    console.error("Failed to update schedule status:", err);
                }
            }

            setSuccess(true);
            setFormData({
                facilityId: '',
                score: 5,
                remarks: '',
                cleanlinessLevel: 'good',
                odorLevel: 'none',
                waterAvailability: 'full',
                suppliesStatus: 'stocked',
                maintenanceRequired: false,
            });
            setImagePreview(null);
            setUploadedImage(null);
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

    const scoreColor = (score) => score >= 7 ? 'text-emerald-500' : score >= 4 ? 'text-amber-500' : 'text-rose-500';

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-2xl">
                            <ClipboardCheck className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-primary">Mission Log</h1>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground tracking-wide opacity-70 pl-14">Initiating New Sanitation Audit</p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-full border px-4">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${currentStep >= step ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground opacity-50'}`}>
                                {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                            </div>
                            {step < 3 && <div className={`w-6 h-0.5 mx-1 rounded-full transition-all duration-500 ${currentStep > step ? 'bg-primary' : 'bg-muted opacity-30'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {success ? (
                <div className="glass-effect border rounded-[3rem] p-16 text-center space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl shadow-emerald-500/10 max-w-lg mx-auto overflow-hidden relative">
                    <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full translate-y-1/2"></div>
                    <div className="relative">
                        <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30 animate-bounce">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mt-6">Audit Synchronized</h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Report transmitted to SanTrack HQ</p>
                    </div>
                    <div className="pt-4">
                        <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold uppercase tracking-tight">
                            <Loader2 className="w-4 h-4 animate-spin" /> Finalizing Connection...
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-effect border rounded-[3.5rem] shadow-2xl shadow-primary/5 overflow-hidden border-white/40">
                    <div className="p-10 md:p-14 space-y-12">

                        {/* Phase 1: Location Assets */}
                        {currentStep === 1 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-primary" /> Phase I: Operations Zone
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Identify the target facility for audit</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Territorial Hub (Village)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                <Building2 className="w-4 h-4" />
                                            </div>
                                            <select
                                                required
                                                value={selectedVillageId}
                                                onChange={(e) => handleVillageChange(e.target.value)}
                                                className="w-full h-14 rounded-2xl border bg-muted/20 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none hover:bg-muted/30"
                                            >
                                                <option value="">Locate Hub...</option>
                                                {villages.map(v => (
                                                    <option key={v._id} value={v._id}>{v.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Asset Identification (Facility)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                <Info className="w-4 h-4" />
                                            </div>
                                            <select
                                                required
                                                disabled={!selectedVillageId}
                                                value={formData.facilityId}
                                                onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                                                className="w-full h-14 rounded-2xl border bg-muted/20 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none hover:bg-muted/30 disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <option value="">
                                                    {!selectedVillageId ? 'Locked...' : 'Identify Asset...'}
                                                </option>
                                                {facilities.map(f => (
                                                    <option key={f._id} value={f._id}>{f.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => formData.facilityId && setCurrentStep(2)}
                                    disabled={!formData.facilityId}
                                    className="w-full h-16 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group disabled:opacity-30 disabled:scale-100"
                                >
                                    Proceed to Assessment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {/* Phase 2: Hygiene Assessment */}
                        {currentStep === 2 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3">
                                        <Activity className="w-6 h-6 text-primary" /> Phase II: Integrity Index
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Evaluate current hygiene & condition status</p>
                                </div>

                                <div className="bg-muted/10 border-2 border-dashed rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full blur-[80px] opacity-10 transition-colors ${formData.score >= 7 ? 'bg-emerald-500' : formData.score >= 4 ? 'bg-amber-500' : 'bg-rose-500'}`}></div>

                                    <div className="flex flex-col items-center gap-4 relative z-10">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hygiene Rating Scale</label>
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-7xl font-bold tracking-tighter ${scoreColor(formData.score)} transition-colors`}>{formData.score}</span>
                                            <span className="text-2xl font-bold opacity-20 uppercase">/10</span>
                                        </div>
                                        <div className="w-full max-w-md px-4 pt-4">
                                            <input
                                                type="range"
                                                min="1" max="10"
                                                value={formData.score}
                                                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                                                className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary shadow-inner"
                                            />
                                            <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-4">
                                                <span className="text-rose-500 opacity-60">Critical Violation</span>
                                                <span className="text-emerald-500 opacity-60">Pristine Status</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: 'cleanlinessLevel', label: 'Sanitation State', icon: Droplets, options: ['excellent', 'good', 'average', 'poor'] },
                                        { id: 'odorLevel', label: 'Atmosphere Log', icon: Wind, options: ['none', 'low', 'moderate', 'high'] },
                                        { id: 'waterAvailability', label: 'Hydraulic Flow', icon: Droplets, options: ['full', 'partial', 'none'] },
                                        { id: 'suppliesStatus', label: 'Inventory Level', icon: Package, options: ['stocked', 'low', 'out_of_stock'] },
                                    ].map((field) => (
                                        <div key={field.id} className="space-y-3 group">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-1.5">
                                                <field.icon className="w-3 h-3" /> {field.label}
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData[field.id]}
                                                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                    className="w-full h-12 rounded-xl border bg-muted/20 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none hover:bg-muted/30"
                                                >
                                                    {field.options.map(opt => (
                                                        <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-40">
                                                    <ArrowRight className="w-3 h-3 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="h-16 px-8 border-2 border-primary/20 hover:border-primary/40 rounded-[2rem] font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 opacity-60 hover:opacity-100"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(3)}
                                        className="flex-1 h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                                    >
                                        Technical Details <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Phase 3: Intelligence & Evidence */}
                        {currentStep === 3 && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic flex items-center gap-3">
                                        <ImageIcon className="w-6 h-6 text-primary" /> Phase III: Audit Evidence
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Capture visuals and finalize report</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Observations (Remarks)</label>
                                        <textarea
                                            rows="4"
                                            required
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                            className="w-full rounded-[2rem] border bg-muted/20 p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none placeholder:text-muted-foreground placeholder:italic"
                                            placeholder="Standard observations recorded during field visit..."
                                        ></textarea>
                                    </div>

                                    <div className="p-4 bg-muted/10 rounded-[2rem] border-2 border-dashed border-muted-foreground/10 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all" onClick={() => setFormData(d => ({ ...d, maintenanceRequired: !d.maintenanceRequired }))}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl transition-all duration-500 ${formData.maintenanceRequired ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-muted text-muted-foreground opacity-40'}`}>
                                                <AlertCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <span className="text-xs font-black uppercase tracking-widest block">Operational Crisis</span>
                                                <span className="text-[10px] text-muted-foreground opacity-60">Toggle if immediate repairs are vital</span>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${formData.maintenanceRequired ? 'bg-rose-500' : 'bg-muted opacity-40'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${formData.maintenanceRequired ? 'right-1' : 'left-1'}`} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Visual Verification (Photo)</label>

                                        {uploadError && (
                                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-3">
                                                <XCircle className="w-4 h-4" /> {uploadError}
                                            </div>
                                        )}

                                        <div className="relative group">
                                            {imagePreview ? (
                                                <div className="relative w-full h-80 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl animate-in zoom-in-95">
                                                    <img src={imagePreview} alt="Evidence" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                                    {uploading && (
                                                        <div className="absolute inset-0 backdrop-blur-sm bg-black/40 flex flex-col items-center justify-center text-white">
                                                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                                            <span className="text-xs font-black uppercase tracking-[0.2em] italic">Transmitting...</span>
                                                        </div>
                                                    )}

                                                    {uploadedImage && !uploading && (
                                                        <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">
                                                            <CheckCircle className="w-3 h-3" /> Integrity Verified
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-6 right-6 p-2 bg-black/30 hover:bg-rose-500 text-white rounded-2xl transition-all border border-white/20 backdrop-blur-md"
                                                    >
                                                        <XCircle className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[3rem] cursor-pointer bg-muted/5 hover:bg-primary/5 border-muted-foreground/20 hover:border-primary/40 transition-all duration-300">
                                                    <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                                                        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                            <Camera className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-widest">Identify Photo Evidence</p>
                                                            <p className="text-[10px] text-muted-foreground opacity-60 mt-1">High-Res JPG/PNG supported (Max 5MB)</p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        className="h-16 px-8 border-2 border-primary/20 hover:border-primary/40 rounded-[2rem] font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 opacity-60 hover:opacity-100"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || uploading || !formData.remarks}
                                        className="flex-1 h-16 bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-30 disabled:scale-100"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
                                        {loading ? 'Transmitting...' : 'Commit Audit'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default InspectionForm;
