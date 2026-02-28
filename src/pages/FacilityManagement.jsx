import React, { useState, useEffect } from 'react';
import { Search, Plus, Building2, MapPin, Activity, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { facilityService } from '../services/facilityService';
import { villageService } from '../services/villageService';
import Modal from '../components/Modal';

const FacilityManagement = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [facilities, setFacilities] = useState([]);
    const [villages, setVillages] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'toilet', villageId: '', condition: 'good' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [facilitiesData, villagesData] = await Promise.all([
                facilityService.getFacilities(),
                villageService.getVillages()
            ]);
            setFacilities(facilitiesData);
            setVillages(villagesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFacility = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await facilityService.createFacility(formData);
            setIsAddModalOpen(false);
            setFormData({ name: '', type: 'toilet', villageId: '', condition: 'good' });
            fetchData();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = facilities.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.villageId?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const getConditionStyle = (condition) => {
        if (condition === 'good') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        if (condition === 'moderate') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    };

    const formatType = (type) => type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Facility Management</h1>
                    <p className="text-muted-foreground">Manage sanitation infrastructure and tracking details.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Facility
                    </button>
                )}
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by facility or village name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Facility Details</th>
                                <th scope="col" className="px-6 py-3">Village</th>
                                <th scope="col" className="px-6 py-3">Condition</th>
                                <th scope="col" className="px-6 py-3">Last Inspected</th>
                                {isAdmin && <th scope="col" className="px-6 py-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        <span className="animate-pulse">Loading data...</span>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        No facilities found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((facility) => (
                                    <tr key={facility._id} className="bg-card border-b hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{facility.name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center mt-1">
                                                    <Building2 className="w-3 h-3 mr-1" />
                                                    {formatType(facility.type)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-muted-foreground">
                                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                                {facility.villageId?.name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center w-fit ${getConditionStyle(facility.condition)}`}>
                                                <Activity className="w-3 h-3 mr-1" />
                                                {formatType(facility.condition)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {facility.lastInspection ? new Date(facility.lastInspection).toLocaleDateString() : 'Never'}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-4 h-4 inline" /></button>
                                                <button className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t bg-muted/30 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Showing {filtered.length} entries</span>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Add Facility Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Facility">
                <form onSubmit={handleAddFacility} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Facility Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Central Water Tank"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Village <span className="text-red-500">*</span></label>
                        <select
                            required
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.villageId}
                            onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
                        >
                            <option value="" disabled>Select a village</option>
                            {villages.map(v => (
                                <option key={v._id} value={v._id}>{v.name} ({v.district})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type <span className="text-red-500">*</span></label>
                            <select
                                required
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="toilet">Public Toilet</option>
                                <option value="well">Community Well</option>
                                <option value="water_tank">Water Tank</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Condition <span className="text-red-500">*</span></label>
                            <select
                                required
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                            >
                                <option value="good">Good</option>
                                <option value="moderate">Moderate</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add Facility'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FacilityManagement;
