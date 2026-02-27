/**
 * My Inspections - Inspector CRUD
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const MyInspections = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ status: '', score: '', findings: '', recommendations: '' });

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/inspections', { params: { page, limit: 10 } });
      setInspections(data.data);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [page]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.score) payload.score = parseInt(payload.score);
      await axiosInstance.put(`/inspections/${editing._id}`, payload);
      setModalOpen(false);
      setEditing(null);
      fetchInspections();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inspection?')) return;
    try {
      await axiosInstance.delete(`/inspections/${id}`);
      fetchInspections();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const openEdit = (i) => {
    setEditing(i);
    setFormData({
      status: i.status,
      score: i.score || '',
      findings: i.findings || '',
      recommendations: i.recommendations || '',
    });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Inspections</h2>
        <Link to="/inspector/inspections/create" className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
          Create Inspection
        </Link>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inspections.map((i) => (
                <tr key={i._id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{i.village?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(i.inspectionDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4"><StatusBadge status={i.status} /></td>
                  <td className="px-6 py-4 text-gray-500">{i.score ?? '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(i)} className="text-primary-600 hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(i._id)} className="text-red-600 hover:underline">Delete</button>
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

      {modalOpen && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit Inspection</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Score</label>
                <input type="number" min={0} max={100} value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Findings</label>
                <textarea value={formData.findings} onChange={(e) => setFormData({ ...formData, findings: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Recommendations</label>
                <textarea value={formData.recommendations} onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })} rows={2} className="w-full px-4 py-2 border rounded-lg" />
              </div>
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

export default MyInspections;
