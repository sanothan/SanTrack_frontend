/**
 * Manage Villages - Admin CRUD
 */

import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const ManageVillages = () => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState(null);
  const [formData, setFormData] = useState({ name: '', district: '', region: '', population: '' });

  const fetchVillages = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/villages', { params: { page, limit: 10 } });
      setVillages(data.data);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVillage) {
        await axiosInstance.put(`/villages/${editingVillage._id}`, formData);
      } else {
        await axiosInstance.post('/villages', formData);
      }
      setModalOpen(false);
      setEditingVillage(null);
      setFormData({ name: '', district: '', region: '', population: '' });
      fetchVillages();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this village?')) return;
    try {
      await axiosInstance.delete(`/villages/${id}`);
      fetchVillages();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const openEdit = (v) => {
    setEditingVillage(v);
    setFormData({ name: v.name, district: v.district, region: v.region || '', population: v.population || '' });
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingVillage(null);
    setFormData({ name: '', district: '', region: '', population: '' });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Villages</h2>
        <button onClick={openCreate} className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
          Add Village
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Population</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {villages.map((v) => (
                <tr key={v._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{v.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{v.district}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{v.region || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{v.population || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => openEdit(v)} className="text-primary-600 hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination.pages > 1 && (
            <div className="px-6 py-3 flex justify-between border-t">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Previous</button>
              <span>Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page >= pagination.pages}>Next</button>
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editingVillage ? 'Edit Village' : 'Add Village'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="District" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
              <input type="text" placeholder="Region" value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              <input type="number" placeholder="Population" value={formData.population} onChange={(e) => setFormData({ ...formData, population: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-lg">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVillages;
