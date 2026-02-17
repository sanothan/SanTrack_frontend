/**
 * Create Inspection - Inspector
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const CreateInspection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedVillage = searchParams.get('village');
  const [villages, setVillages] = useState([]);
  const [formData, setFormData] = useState({
    village: preselectedVillage || '',
    status: 'Pending',
    score: '',
    findings: '',
    recommendations: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVillages = async () => {
      const { data } = await axiosInstance.get('/villages?limit=100');
      setVillages(data.data || []);
      if (preselectedVillage && !formData.village) setFormData((f) => ({ ...f, village: preselectedVillage }));
    };
    fetchVillages();
  }, [preselectedVillage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.score) payload.score = parseInt(payload.score);
      await axiosInstance.post('/inspections', payload);
      navigate('/inspector/inspections');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create inspection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Inspection</h2>
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
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Score (0-100)</label>
          <input type="number" min={0} max={100} value={formData.score} onChange={(e) => setFormData({ ...formData, score: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Findings</label>
          <textarea value={formData.findings} onChange={(e) => setFormData({ ...formData, findings: e.target.value })} rows={4} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Recommendations</label>
          <textarea value={formData.recommendations} onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg" />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-primary-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Inspection'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 px-6 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInspection;
