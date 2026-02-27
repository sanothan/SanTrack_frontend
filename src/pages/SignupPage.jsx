import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext.jsx';

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const roleOptions = [
  { key: 'community_leader', label: 'Community Leader', description: 'Report sanitation issues and track improvements.' },
  { key: 'inspector', label: 'Inspector', description: 'Record inspections and sanitation scores.' },
  { key: 'admin', label: 'Administrator', description: 'Manage users, villages, and system configuration.' },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { register: signup, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState('community_leader');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const user = await signup({
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: selectedRole,
      });

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'inspector') {
        navigate('/inspector/dashboard');
      } else {
        navigate('/leader/dashboard');
      }
    } catch (error) {
      // toast handled in auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center text-sm text-emerald-700 hover:text-emerald-900"
        >
          <span className="mr-1">←</span>
          Back to welcome
        </button>
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-emerald-100">
          <div className="px-6 py-6 border-b border-emerald-50 bg-emerald-50">
            <h2 className="text-2xl font-bold text-emerald-900 text-center">Create your SanTrack account</h2>
            <p className="mt-2 text-sm text-emerald-700 text-center">
              Choose your role and help improve rural sanitation.
            </p>
          </div>

          <div className="px-6 pt-6">
            <p className="text-xs font-medium text-emerald-900 mb-2">I am a</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {roleOptions.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedRole(role.key)}
                  className={`flex flex-col items-start justify-between rounded-xl border px-3 py-3 text-left text-sm transition ${
                    selectedRole === role.key
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-emerald-100 bg-white hover:bg-emerald-50'
                  }`}
                >
                  <span className="font-semibold text-emerald-900">{role.label}</span>
                  <span className="mt-1 text-[11px] text-emerald-700">{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">First Name</label>
                  <input
                    {...register('firstName')}
                    type="text"
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                      errors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Last Name</label>
                  <input
                    {...register('lastName')}
                    type="text"
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                      errors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Phone Number</label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Password</label>
                  <input
                    {...register('password')}
                    type="password"
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                    placeholder="At least 6 characters"
                  />
                  {errors.password && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Confirm Password</label>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="mt-2 w-full inline-flex justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
              >
                {isSubmitting || isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-emerald-700 hover:text-emerald-900">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

