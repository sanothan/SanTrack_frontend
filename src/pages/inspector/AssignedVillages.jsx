/**
 * Assigned Villages - Inspector view
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';

const AssignedVillages = () => {
  const { user } = useAuth();
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const { data } = await axiosInstance.get('/villages');
        const all = data.data || [];
        // Filter by assigned inspector (if user has village assignment)
        const assigned = user?.village
          ? all.filter((v) => v.assignedInspector?._id === user.id || v._id === user.village)
          : all;
        setVillages(assigned);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVillages();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Villages</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {villages.map((v) => (
            <div key={v._id} className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="font-semibold text-primary-800">{v.name}</h3>
              <p className="text-gray-500 text-sm">{v.district}</p>
              <p className="text-gray-500 text-sm">{v.region || '-'}</p>
              <p className="text-gray-600 mt-2">Population: {v.population || 'N/A'}</p>
              <Link to={`/inspector/inspections/create?village=${v._id}`} className="mt-4 inline-block text-primary-600 hover:underline text-sm">
                Create Inspection →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedVillages;
