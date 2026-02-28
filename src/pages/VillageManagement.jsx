import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, MoreVertical, Edit2, Trash2, X } from 'lucide-react';
import { villageService } from '../services/villageService';
import Modal from '../components/Modal';

const VillageManagement = () => {
    const [villages, setVillages] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', district: '', state: '', population: '' });
    const [submitting, setSubmitting] = useState(false);

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
            // fallback for demo
            setVillages([
                { _id: '1', name: 'Springfield', population: 5000, facilitiesCount: 12 },
                { _id: '2', name: 'Shelbyville', population: 4200, facilitiesCount: 8 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVillage = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await villageService.createVillage({
                name: formData.name,
                district: formData.district,
                state: formData.state,
                population: Number(formData.population) || 0,
                gps: {
                    lat: 0.0,
                    lng: 0.0
                }
            });
            setIsAddModalOpen(false);
            setFormData({ name: '', district: '', state: '', population: '' });
            fetchVillages(); // Refresh the list
        } catch (error) {
            console.error("Error creating village", error);
        } finally {
            setSubmitting(false);
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
                    onClick={() => setIsAddModalOpen(true)}
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
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">
                                        <span className="animate-pulse">Loading data...</span>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">
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
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-4 h-4 inline" /></button>
                                            <button className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4 inline" /></button>
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

            {/* Add Village Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Village">
                <form onSubmit={handleAddVillage} className="space-y-4">
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
                            <label className="text-sm font-medium">State <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Population</label>
                        <input
                            type="number"
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.population}
                            onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                        />
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
        </div>
    );
};

export default VillageManagement;
