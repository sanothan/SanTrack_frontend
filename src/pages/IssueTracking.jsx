import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import { issueService } from '../services/issueService';
import { useAuth } from '../context/AuthContext';

const IssueTracking = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit modal state
    const [editingIssue, setEditingIssue] = useState(null);
    const [editForm, setEditForm] = useState({ description: '', status: 'pending', assignedTo: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    // Delete confirmation state
    const [deletingId, setDeletingId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const data = await issueService.getIssues();
            setIssues(data);
        } catch (error) {
            console.error('Failed to fetch issues', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="flex items-center text-red-700 bg-red-100 px-2.5 py-1 rounded-full text-xs font-medium w-max">
                        <AlertCircle className="w-3 h-3 mr-1" /> Pending
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="flex items-center text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full text-xs font-medium w-max">
                        <Clock className="w-3 h-3 mr-1" /> In Progress
                    </span>
                );
            case 'resolved':
                return (
                    <span className="flex items-center text-green-700 bg-green-100 px-2.5 py-1 rounded-full text-xs font-medium w-max">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
                    </span>
                );
            default:
                return <span>{status}</span>;
        }
    };

    // ── Edit handlers ──────────────────────────────────────────────────────────
    const openEdit = (issue) => {
        setEditingIssue(issue);
        setEditForm({
            description: issue.description || '',
            status: issue.status || 'pending',
            assignedTo: issue.assignedTo || '',
        });
        setEditError('');
    };

    const closeEdit = () => {
        setEditingIssue(null);
        setEditError('');
    };

    const handleEditSave = async () => {
        if (!editForm.description.trim()) {
            setEditError('Description cannot be empty.');
            return;
        }
        setEditLoading(true);
        setEditError('');
        try {
            await issueService.updateIssue(editingIssue._id, {
                description: editForm.description.trim(),
                status: editForm.status,
                assignedTo: editForm.assignedTo,
            });
            await fetchIssues();
            closeEdit();
        } catch (err) {
            console.error(err);
            setEditError(err?.response?.data?.message || 'Failed to update issue.');
        } finally {
            setEditLoading(false);
        }
    };

    // ── Delete handlers ────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        setDeleteLoading(true);
        try {
            await issueService.deleteIssue(id);
            await fetchIssues();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.message || 'Failed to delete issue.');
        } finally {
            setDeleteLoading(false);
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Issue Tracking</h1>
                    <p className="text-muted-foreground">Monitor and resolve facility issues.</p>
                </div>
            </div>

            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4">Issue ID / Title</th>
                                <th className="px-6 py-4">Facility</th>
                                <th className="px-6 py-4">Reported On</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        Loading issues...
                                    </td>
                                </tr>
                            ) : issues.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                                        No tracking issues found.
                                    </td>
                                </tr>
                            ) : (
                                issues.map((issue) => (
                                    <tr key={issue._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-muted-foreground block mb-1">
                                                {issue.isPublic ? 'Public Report' : 'Inspector Field Report'}
                                            </span>
                                            <span className="font-medium line-clamp-2" title={issue.description}>
                                                {issue.description}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {issue.facilityId?.name || 'Unknown Facility'}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(issue.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Status dropdown — non-admin only */}
                                                {!isAdmin && (
                                                    <select
                                                        value={issue.status}
                                                        onChange={(e) => {
                                                            const newStatus = e.target.value;
                                                            issueService
                                                                .updateIssue(issue._id, { status: newStatus })
                                                                .then(() => {
                                                                    fetchIssues();
                                                                    alert(`Status updated to ${newStatus}.`);
                                                                })
                                                                .catch((err) => {
                                                                    console.error(err);
                                                                    alert('Failed to update status.');
                                                                });
                                                        }}
                                                        className="text-sm border rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="in_progress">Set In Progress</option>
                                                        <option value="resolved">Mark Resolved</option>
                                                    </select>
                                                )}

                                                {/* Edit button — admin only */}
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => openEdit(issue)}
                                                        title="Edit issue"
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                )}

                                                {/* Delete button — admin only, enabled only when resolved */}
                                                {isAdmin && (
                                                    <button
                                                        onClick={() =>
                                                            issue.status === 'resolved'
                                                                ? setDeletingId(issue._id)
                                                                : undefined
                                                        }
                                                        disabled={issue.status !== 'resolved'}
                                                        title={
                                                            issue.status === 'resolved'
                                                                ? 'Delete issue'
                                                                : 'Can only delete resolved issues'
                                                        }
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${issue.status === 'resolved'
                                                                ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer'
                                                                : 'border-muted text-muted-foreground cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
            {editingIssue && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Edit Issue</h2>
                            <button
                                onClick={closeEdit}
                                className="p-1 rounded-md hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                    rows={4}
                                    className="w-full text-sm border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                                    className="w-full text-sm border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            {/* Assigned To */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Assigned To</label>
                                <input
                                    type="text"
                                    value={editForm.assignedTo}
                                    onChange={(e) => setEditForm((f) => ({ ...f, assignedTo: e.target.value }))}
                                    placeholder="Enter assignee name or leave blank"
                                    className="w-full text-sm border rounded-md px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            {editError && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                    {editError}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeEdit}
                                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={editLoading}
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-60 transition-colors"
                            >
                                {editLoading ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg mt-0.5">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Delete Issue?</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deletingId)}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60 transition-colors"
                            >
                                {deleteLoading ? 'Deleting…' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IssueTracking;
