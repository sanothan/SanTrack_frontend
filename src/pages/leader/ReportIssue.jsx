/**
 * Report Issue - Community Leader
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const ReportIssue = () => {
  const navigate = useNavigate();
  const [villages, setVillages] = useState([]);
  const [formData, setFormData] = useState({
    village: '',
    title: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVillages = async () => {
      const { data } = await axiosInstance.get('/villages?limit=100');
      setVillages(data.data || []);
    };
    fetchVillages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/issues', formData);
      navigate('/leader/issues');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Report Issue</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Village *</label>
          <select
            value={formData.village}
            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select village</option>
            {villages.map((v) => (
              <option key={v._id} value={v._id}>{v.name} - {v.district}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
              <option value="Water Supply">Water Supply</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Drainage">Drainage</option>
              <option value="Hygiene">Hygiene</option>
              <option value="Toilet Facilities">Toilet Facilities</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location (optional)</label>
          <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Issue'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 px-6 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
