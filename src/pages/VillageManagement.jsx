import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';
import { villageService } from '../services/villageService';
import Modal from '../components/Modal';
import LocationPicker from '../components/LocationPicker';

const VillageManagement = () => {
    const [villages, setVillages] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Add modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVillage, setEditingVillage] = useState(null);

    // Delete confirmation
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingVillage, setDeletingVillage] = useState(null);

    const [formData, setFormData] = useState({
        name: '', district: '', state: '', population: '',
        lat: '', lng: '', address: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    useEffect(() => {
        fetchVillages();
    }, []);

    const fetchVillages = async () => {
        setLoading(true);
        try {
            const data = await villageService.getVillages();
            setVillages(data);
        } catch (error) {
            console.error(error);
            setVillages([
                { _id: '1', name: 'Springfield', population: 5000, facilitiesCount: 12, gps: { lat: 7.8731, lng: 80.7718 } },
                { _id: '2', name: 'Shelbyville', population: 4200, facilitiesCount: 8, gps: { lat: 6.9271, lng: 79.8612 } }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => setFormData({ name: '', district: '', state: '', population: '', lat: '', lng: '', address: '' });

    // ── ADD ──────────────────────────────────────────────────────────────────
    const handleAddVillage = async (e) => {
        e.preventDefault();
        if (!formData.lat || !formData.lng) {
            alert('Please click on the map to select the village location.');
            return;
        }
        setSubmitting(true);
        try {
            await villageService.createVillage({
                name: formData.name,
                district: formData.district,
                state: formData.state,
                population: Number(formData.population) || 0,
                gps: {
                    lat: Number(formData.lat),
                    lng: Number(formData.lng)
                }
            });
            setIsAddModalOpen(false);
            resetForm();
            fetchVillages();
        } catch (error) {
            console.error('Error creating village', error);
        } finally {
            setSubmitting(false);
        }
    };

    // ── EDIT ─────────────────────────────────────────────────────────────────
    const openEditModal = (village) => {
        setEditingVillage(village);
        setFormData({
            name: village.name || '',
            district: village.district || '',
            state: village.state || '',
            population: village.population || '',
            lat: village.gps?.lat ?? '',
            lng: village.gps?.lng ?? '',
            address: '' // This will be filled by geocoding if they click the map again
        });
        setIsEditModalOpen(true);
    };

    const handleEditVillage = async (e) => {
        e.preventDefault();
        if (!formData.lat || !formData.lng) {
            alert('Please click on the map to select the village location.');
            return;
        }
        setSubmitting(true);
        try {
            await villageService.updateVillage(editingVillage._id, {
                name: formData.name,
                district: formData.district,
                state: formData.state,
                population: Number(formData.population) || 0,
                gps: {
                    lat: Number(formData.lat),
                    lng: Number(formData.lng)
                }
            });
            setIsEditModalOpen(false);
            setEditingVillage(null);
            resetForm();
            fetchVillages();
        } catch (error) {
            console.error('Error updating village', error);
        } finally {
            setSubmitting(false);
        }
    };

    // ── DELETE ────────────────────────────────────────────────────────────────
    const openDeleteModal = (village) => {
        setDeletingVillage(village);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteVillage = async () => {
        setSubmitting(true);
        try {
            await villageService.deleteVillage(deletingVillage._id);
            setIsDeleteModalOpen(false);
            setDeletingVillage(null);
            fetchVillages();
        } catch (error) {
            console.error('Error deleting village', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLocationSelect = async ({ lat, lng }) => {
        setFormData(prev => ({ ...prev, lat, lng }));

        setIsGeocoding(true);
        try {
            const data = await villageService.reverseGeocode(lat, lng);
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    address: data.formattedAddress || '',
                    district: data.district || prev.district,
                    state: data.state || prev.state
                }));
            }
        } catch (error) {
            console.error("Geocoding failed:", error);
        } finally {
            setIsGeocoding(false);
        }
    };

    const filtered = villages.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));



    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Village Management</h1>
                    <p className="text-muted-foreground">Manage service areas and geographical units.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm flex items-center hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Village
                </button>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search villages..."
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
                                <th scope="col" className="px-6 py-3">Village Name</th>
                                <th scope="col" className="px-6 py-3">Population</th>
                                <th scope="col" className="px-6 py-3">Facilities</th>
                                <th scope="col" className="px-6 py-3">Coordinates</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
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
                                        No villages found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((village) => (
                                    <tr key={village._id} className="bg-card border-b hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                                            {village.name}
                                        </td>
                                        <td className="px-6 py-4">{village.population?.toLocaleString() || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                                {village.facilitiesCount || 0} Facilities
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                                            {village.gps?.lat != null
                                                ? `${(+village.gps.lat).toFixed(4)}, ${(+village.gps.lng).toFixed(4)}`
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(village)}
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4 inline" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(village)}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 inline" />
                                            </button>
                                        </td>
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

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Village" maxWidth="max-w-2xl">
                <form onSubmit={handleAddVillage} className="space-y-4">
                    {/* Village Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Village Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    {/* District + State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">District <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">State / Province</label>
                            <input
                                type="text"
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Population */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Population</label>
                        <input
                            type="number"
                            min="0"
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.population}
                            onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                        />
                    </div>
                    {/* Map */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Village Location <span className="text-red-500">*</span>
                        </label>
                        {isAddModalOpen && (
                            <LocationPicker
                                onLocationSelect={handleLocationSelect}
                            />
                        )}
                        {formData.lat && formData.lng ? (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3 text-xs bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md px-3 py-2">
                                    <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                                    <span className="text-green-800 dark:text-green-300 font-medium">
                                        Location selected: {Number(formData.lat).toFixed(5)}°N, {Number(formData.lng).toFixed(5)}°E
                                    </span>
                                </div>
                                {isGeocoding ? (
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground animate-pulse px-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                        <span>Fetching address details...</span>
                                    </div>
                                ) : formData.address && (
                                    <div className="text-[10px] text-muted-foreground bg-muted/30 p-2 rounded border border-dashed italic">
                                        Detected: {formData.address}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md px-3 py-2">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span>No location selected yet — click the map above</span>
                            </div>
                        )}
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
                            {submitting ? 'Adding...' : 'Add Village'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Edit Village Modal ────────────────────────────────────────────── */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Village" maxWidth="max-w-2xl">
                <form onSubmit={handleEditVillage} className="space-y-4">
                    {/* Village Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Village Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    {/* District + State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">District <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">State / Province</label>
                            <input
                                type="text"
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                    </div>
                    {/* Population */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Population</label>
                        <input
                            type="number"
                            min="0"
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.population}
                            onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                        />
                    </div>
                    {/* Map */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Village Location</label>
                        {isEditModalOpen && (
                            <LocationPicker
                                initialLocation={
                                    formData.lat && formData.lng
                                        ? { lat: Number(formData.lat), lng: Number(formData.lng) }
                                        : null
                                }
                                onLocationSelect={handleLocationSelect}
                            />
                        )}
                        {formData.lat && formData.lng ? (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3 text-xs bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md px-3 py-2">
                                    <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                                    <span className="text-green-800 dark:text-green-300 font-medium">
                                        Location selected: {Number(formData.lat).toFixed(5)}°N, {Number(formData.lng).toFixed(5)}°E
                                    </span>
                                </div>
                                {isGeocoding ? (
                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground animate-pulse px-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                        <span>Fetching address details...</span>
                                    </div>
                                ) : formData.address && (
                                    <div className="text-[10px] text-muted-foreground bg-muted/30 p-2 rounded border border-dashed italic">
                                        Detected: {formData.address}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md px-3 py-2">
                                <MapPin className="w-4 h-4 shrink-0" />
                                <span>No location selected yet — click the map above</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Village">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">{deletingVillage?.name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="pt-2 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteVillage}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Deleting...' : 'Delete Village'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default VillageManagement;
