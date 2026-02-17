/**
 * Village Status - Community Leader view
 */

import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const VillageStatus = () => {
  const [villages, setVillages] = useState([]);
  const [issuesByVillage, setIssuesByVillage] = useState({});
  const [inspectionsByVillage, setInspectionsByVillage] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [villagesRes, issuesRes, inspectionsRes] = await Promise.all([
          axiosInstance.get('/villages?limit=100'),
          axiosInstance.get('/issues?limit=200'),
          axiosInstance.get('/inspections?limit=200'),
        ]);
        const v = villagesRes.data.data || [];
        setVillages(v);

        const issues = issuesRes.data.data || [];
        const insp = inspectionsRes.data.data || [];
        const issuesMap = {};
        const inspMap = {};
        issues.forEach((i) => {
          const vid = i.village?._id || i.village;
          if (!issuesMap[vid]) issuesMap[vid] = [];
          issuesMap[vid].push(i);
        });
        insp.forEach((i) => {
          const vid = i.village?._id || i.village;
          if (!inspMap[vid]) inspMap[vid] = [];
          inspMap[vid].push(i);
        });
        setIssuesByVillage(issuesMap);
        setInspectionsByVillage(inspMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Village Status</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {villages.map((v) => {
          const vid = v._id;
          const issues = issuesByVillage[vid] || [];
          const inspections = inspectionsByVillage[vid] || [];
          return (
            <div key={v._id} className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="font-semibold text-primary-800 text-lg">{v.name}</h3>
              <p className="text-gray-500 text-sm">{v.district}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Issues</p>
                  <p className="text-2xl font-bold text-primary-600">{issues.length}</p>
                  {issues.slice(0, 2).map((i) => (
                    <p key={i._id} className="text-xs text-gray-500 flex items-center gap-1">
                      <StatusBadge status={i.status} /> {i.title}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Inspections</p>
                  <p className="text-2xl font-bold text-secondary-600">{inspections.length}</p>
                  {inspections.slice(0, 2).map((i) => (
                    <p key={i._id} className="text-xs text-gray-500 flex items-center gap-1">
                      <StatusBadge status={i.status} /> Score: {i.score ?? '-'}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VillageStatus;
