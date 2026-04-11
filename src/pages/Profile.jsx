import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield, Save, Trash2, AlertCircle, CheckCircle, Eye, EyeOff, MapPin, FileText, Lock, Pencil, X, PauseCircle } from 'lucide-react';
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
    const roleLabel = user?.role === 'community'
        ? 'Community Member'
        : user?.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : '';
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        bio: user?.bio || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivateReason, setDeactivateReason] = useState('');
    const [deactivatePassword, setDeactivatePassword] = useState('');
    const [deactivateLoading, setDeactivateLoading] = useState(false);
    const [deactivateError, setDeactivateError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [verifyingPassword, setVerifyingPassword] = useState(false);

    useEffect(() => {
        if (!user) return;

        setFormData((prev) => ({
            ...prev,
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            bio: user.bio || '',
        }));
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                bio: formData.bio,
            };

            const response = await api.put('/auth/profile', payload);

            // Update user stored in localStorage
            const updatedUser = { ...user, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditMode(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData((prev) => ({
            ...prev,
            name: user?.name || '',
            phone: user?.phone || '',
            address: user?.address || '',
            bio: user?.bio || '',
        }));
        setMessage({ type: '', text: '' });
        setIsEditMode(false);
    };

    const handlePasswordChange = (e) => {
        if (e.target.name === 'currentPassword') {
            setPasswordVerified(false);
        }
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setShowPassword(false);
        setPasswordError('');
        setPasswordVerified(false);
        setVerifyingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleVerifyCurrentPassword = async () => {
        setPasswordError('');

        if (!passwordData.currentPassword) {
            setPasswordError('Current password is required.');
            return;
        }

        setVerifyingPassword(true);
        try {
            await api.post('/auth/verify-password', { password: passwordData.currentPassword });
            setPasswordVerified(true);
        } catch (err) {
            setPasswordVerified(false);
            setPasswordError(err.response?.data?.message || 'Current password verification failed.');
        } finally {
            setVerifyingPassword(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (!passwordData.currentPassword) {
            setPasswordError('Current password is required.');
            return;
        }
        if (!passwordVerified) {
            setPasswordError('Please verify your current password first.');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        setPasswordLoading(true);
        try {
            await api.put('/auth/profile', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            closePasswordModal();
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) return;
        const shouldDelete = window.confirm('Are you absolutely sure you want to permanently delete your account? This cannot be undone.');
        if (!shouldDelete) return;

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

    const closeDeactivateModal = () => {
        setShowDeactivateModal(false);
        setDeactivateReason('');
        setDeactivatePassword('');
        setDeactivateError('');
    };

    const handleDeactivateAccount = async () => {
        setDeactivateError('');

        if (!deactivateReason) {
            setDeactivateError('Please select a reason for deactivation.');
            return;
        }

        const shouldDeactivate = window.confirm('Deactivate account now? You can recover it within 1 year before automatic deletion.');
        if (!shouldDeactivate) return;

        setDeactivateLoading(true);
        try {
            const response = await api.post('/auth/deactivate', {
                reason: deactivateReason,
                password: deactivatePassword,
            });

            closeDeactivateModal();
            window.alert(response.data?.message || 'Account deactivated. It will be permanently deleted after 1 year.');
            logout();
        } catch (err) {
            setDeactivateError(err.response?.data?.message || 'Failed to deactivate account.');
        } finally {
            setDeactivateLoading(false);
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
                <div className="relative p-6 border-b bg-muted/30 flex items-center space-x-4 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80')" }}
                    ></div>
                    <div className="relative z-10 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                        <User className="w-8 h-8" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                            <Shield className="w-3 h-3 mr-1" />
                            {roleLabel}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-4 flex justify-end">
                        {!isEditMode ? (
                            <button
                                type="button"
                                onClick={() => setIsEditMode(true)}
                                className="inline-flex items-center space-x-2 px-3 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                            >
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="inline-flex items-center space-x-2 px-3 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" />
                                <span>Cancel</span>
                            </button>
                        )}
                    </div>

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

                        <InputField label="Full Name" icon={User} name="name" value={formData.name} onChange={handleChange} disabled={!isEditMode} placeholder="Your full name" />
                        <InputField label="Email Address" icon={Mail} name="email" value={user?.email || ''} disabled hint="Email cannot be changed. Contact admin." />
                        <InputField label="Phone Number" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditMode} placeholder="+94 77 123 4567" />
                        <InputField label="Address" icon={MapPin} name="address" value={formData.address} onChange={handleChange} disabled={!isEditMode} placeholder="Your address or city" />

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
                                    disabled={!isEditMode}
                                    placeholder="Tell us a little about yourself..."
                                    className={cn(
                                        "flex w-full rounded-md border px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-y",
                                        !isEditMode ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-background"
                                    )}
                                />
                            </div>
                        </div>

                        {isEditMode && (
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
                        )}
                    </form>

                    <div className="mt-6 pt-5 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                setPasswordError('');
                                setShowPasswordModal(true);
                            }}
                            className="inline-flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors"
                        >
                            <Lock className="w-4 h-4" />
                            <span>Change Password</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-card border border-destructive/30 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <h3 className="font-semibold text-destructive mb-1">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setDeactivateError('');
                                setShowDeactivateModal(true);
                            }}
                            className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-amber-600 transition-colors"
                        >
                            <PauseCircle className="w-4 h-4" />
                            <span>Deactivate Account</span>
                        </button>
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

            {/* Deactivate Account Modal */}
            {showDeactivateModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closeDeactivateModal}>
                    <div className="bg-card border rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                                <PauseCircle className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">Deactivate Account</h3>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">
                            Your account will be deactivated immediately and permanently deleted after 1 year.
                        </p>

                        {deactivateError && (
                            <div className="mb-4 p-3 rounded-md border border-destructive/20 bg-destructive/10 text-destructive text-sm">
                                {deactivateError}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-sm font-medium">Reason for deactivation</label>
                            <select
                                value={deactivateReason}
                                onChange={(e) => setDeactivateReason(e.target.value)}
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Select a reason</option>
                                <option value="I no longer use this service">I no longer use this service</option>
                                <option value="I have privacy concerns">I have privacy concerns</option>
                                <option value="I created another account">I created another account</option>
                                <option value="Other">Other</option>
                            </select>

                            <input
                                type="password"
                                value={deactivatePassword}
                                onChange={(e) => setDeactivatePassword(e.target.value)}
                                placeholder="Enter your password"
                                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="mt-5 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeDeactivateModal}
                                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeactivateAccount}
                                disabled={deactivateLoading}
                                className="px-4 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-60"
                            >
                                {deactivateLoading ? 'Deactivating...' : 'Deactivate Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={closePasswordModal}>
                    <div className="bg-card border rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-primary/10 text-primary rounded-full">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">Change Password</h3>
                        </div>

                        {passwordError && (
                            <div className="mb-4 p-3 rounded-md border border-destructive/20 bg-destructive/10 text-destructive text-sm">
                                {passwordError}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <InputField
                                label="Current Password"
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                disabled={passwordLoading || verifyingPassword}
                                placeholder="Enter current password"
                            />
                            <div className="flex justify-between items-center -mt-1">
                                <button
                                    type="button"
                                    onClick={handleVerifyCurrentPassword}
                                    disabled={!passwordData.currentPassword || passwordLoading || verifyingPassword}
                                    className="text-xs px-2.5 py-1.5 rounded-md border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {verifyingPassword ? 'Verifying...' : 'Verify Current Password'}
                                </button>
                                {passwordVerified && <span className="text-xs text-green-700 font-medium">Verified</span>}
                            </div>
                            <InputField
                                label="New Password"
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                disabled={!passwordVerified || passwordLoading}
                                placeholder={passwordVerified ? 'Minimum 6 characters' : 'Verify current password first'}
                            />
                            <InputField
                                label="Confirm New Password"
                                icon={Lock}
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                disabled={!passwordVerified || passwordLoading}
                                placeholder={passwordVerified ? 'Repeat new password' : 'Verify current password first'}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {showPassword ? 'Hide passwords' : 'Show passwords'}
                            </button>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closePasswordModal}
                                    className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordLoading || !passwordVerified}
                                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{passwordLoading ? 'Saving...' : 'Update Password'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
