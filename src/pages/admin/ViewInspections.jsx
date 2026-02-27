/**
 * View Inspections - Admin read-only
 */

import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const ViewInspections = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await axiosInstance.get('/inspections', { params });
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
  }, [page, statusFilter]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">View Inspections</h2>
      <div className="mb-4 flex gap-2">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2 border rounded-lg">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inspector</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inspections.map((i) => (
                <tr key={i._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{i.village?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{i.inspector?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(i.inspectionDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={i.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{i.score ?? '-'}</td>
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
    </div>
  );
};

export default ViewInspections;
