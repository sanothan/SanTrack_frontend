/**
 * My Issues - Community Leader CRUD
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: '', category: '', priority: '' });

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/issues', { params: { page, limit: 10 } });
      setIssues(data.data);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [page]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/issues/${editing._id}`, formData);
      setModalOpen(false);
      setEditing(null);
      fetchIssues();
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this issue?')) return;
    try {
      await axiosInstance.delete(`/issues/${id}`);
      fetchIssues();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const openEdit = (issue) => {
    setEditing(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      category: issue.category,
      priority: issue.priority,
    });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Issues</h2>
        <Link to="/leader/issues/report" className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
          Report Issue
        </Link>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.map((i) => (
                <tr key={i._id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{i.title}</td>
                  <td className="px-6 py-4 text-gray-500">{i.village?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{i.category || '-'}</td>
                  <td className="px-6 py-4"><StatusBadge status={i.status} /></td>
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
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Edit Issue</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} className="w-full px-4 py-2 border rounded-lg" />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                <option value="Water Supply">Water Supply</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Drainage">Drainage</option>
                <option value="Hygiene">Hygiene</option>
                <option value="Toilet Facilities">Toilet Facilities</option>
                <option value="Other">Other</option>
              </select>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
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

export default MyIssues;
