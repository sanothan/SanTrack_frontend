import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Save, Trash2, AlertCircle, CheckCircle, Eye, EyeOff, MapPin, FileText, Lock } from 'lucide-react';
import { cn } from '../utils/cn';
import api from '../services/api';

const InputField = ({ label, icon: Icon, type = 'text', name, value, onChange, disabled, placeholder, hint }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium leading-none">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Icon className="w-4 h-4" />
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                    "flex h-10 w-full rounded-md border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all",
                    disabled ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"
                )}
            />
        </div>
        {hint && <p className="text-[10px] text-muted-foreground italic">{hint}</p>}
    </div>
);

const Profile = () => {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        bio: user?.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (formData.newPassword && formData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                bio: formData.bio,
            };

            if (formData.newPassword) {
                payload.currentPassword = formData.currentPassword;
                payload.newPassword = formData.newPassword;
            }

            const response = await api.put('/auth/profile', payload);

            // Update user stored in localStorage
            const updatedUser = { ...user, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) return;
        setDeleteLoading(true);
        try {
            await api.delete('/auth/account', { data: { password: deletePassword } });
            logout(); // logs out and redirects to /login
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete account.' });
            setShowDeleteModal(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto py-12 px-4 sm:px-6 w-full">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and account settings.</p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-muted/30 flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                            <Shield className="w-3 h-3 mr-1" />
                            {user?.role}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={cn(
                            "mb-6 p-4 rounded-lg border flex items-center text-sm",
                            message.type === 'success'
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                        )}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4 mr-2 shrink-0" /> : <AlertCircle className="w-4 h-4 mr-2 shrink-0" />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Basic Info */}
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</p>

                        <InputField label="Full Name" icon={User} name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" />
                        <InputField label="Email Address" icon={Mail} name="email" value={user?.email || ''} disabled hint="Email cannot be changed. Contact admin." />
                        <InputField label="Phone Number" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} placeholder="+94 77 123 4567" />
                        <InputField label="Address" icon={MapPin} name="address" value={formData.address} onChange={handleChange} placeholder="Your address or city" />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium leading-none">Bio</label>
                            <div className="relative">
                                <div className="absolute top-2.5 left-3 pointer-events-none text-muted-foreground">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <textarea
                                    name="bio"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us a little about yourself..."
                                    className="flex w-full rounded-md border bg-background px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y"
                                />
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="pt-2 border-t">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Change Password <span className="font-normal normal-case">(optional)</span></p>
                            <div className="space-y-4">
                                <InputField label="Current Password" icon={Lock} type={showPassword ? 'text' : 'password'} name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter current password" />
                                <InputField label="New Password" icon={Lock} type={showPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Minimum 6 characters" />
                                <InputField label="Confirm New Password" icon={Lock} type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat new password" />
                                <button type="button" onClick={() => setShowPassword(p => !p)} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
                                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                    {showPassword ? 'Hide passwords' : 'Show passwords'}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-70"
                            >
                                <Save className="w-4 h-4" />
                                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-card border border-destructive/30 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <h3 className="font-semibold text-destructive mb-1">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center space-x-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-destructive/90 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete My Account</span>
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-card border rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-red-100 text-red-600 rounded-full dark:bg-red-900/30">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">Delete Account</h3>
                        </div>
                        <p className="text-muted-foreground text-sm mb-5">
                            This will permanently delete your account. To confirm, please enter your password.
                        </p>
                        <input
                            type="password"
                            placeholder="Enter your password to confirm"
                            value={deletePassword}
                            onChange={e => setDeletePassword(e.target.value)}
                            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-destructive"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={!deletePassword || deleteLoading}
                                className="flex items-center space-x-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-60"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>{deleteLoading ? 'Deleting...' : 'Delete Account'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
