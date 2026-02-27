/**
 * Manage Users - Admin CRUD
 */

import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'communityLeader', isActive: true });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/users', { params: { page, limit: 10, search } });
      setUsers(data.data);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await axiosInstance.put(`/users/${editingUser._id}`, payload);
      } else {
        await axiosInstance.post('/users', formData);
      }
      setModalOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'communityLeader', isActive: true });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'communityLeader', isActive: true });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <button onClick={openCreate} className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg">
          Add User
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg w-64"
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.isActive ? 'Completed' : 'Pending'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => openEdit(user)} className="text-primary-600 hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">Delete</button>
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
            <h3 className="text-lg font-bold mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-2 border rounded-lg" disabled={!!editingUser} />
              <input type="password" placeholder={editingUser ? 'New password (leave blank to keep)' : 'Password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required={!editingUser} />
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                <option value="admin">Admin</option>
                <option value="inspector">Inspector</option>
                <option value="communityLeader">Community Leader</option>
              </select>
              {editingUser && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  Active
                </label>
              )}
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

export default ManageUsers;
