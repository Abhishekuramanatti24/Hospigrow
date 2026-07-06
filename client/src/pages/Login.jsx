// pages/Login.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  // Already logged in? Don't show the login page again.
  if (!authLoading && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (formData) => {
    setServerError('');
    setSubmitting(true);
    try {
      const user = await login(formData.email, formData.password, formData.remember);
      showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 401) {
        setServerError(message || 'Invalid Credentials');
      } else if (status === 400) {
        setServerError(message || 'Please check the details you entered.');
      } else if (!err.response) {
        setServerError('Unable to reach the server. Please try again.');
      } else {
        setServerError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-accent-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl card-shadow p-8 sm:p-10">
          {/* Logo + Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center mb-4">
              <FiActivity className="text-white" size={30} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Student Learning Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to continue your learning</p>
          </div>

          {/* Server-side error banner */}
          {serverError && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  placeholder="you@student.edu"
                  className={`w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-brand-500/40 ${
                    errors.email ? 'border-red-400' : 'border-slate-200 focus:border-brand-500'
                  }`}
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: 'Please enter a valid email address.',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-brand-500/40 ${
                    errors.password ? 'border-red-400' : 'border-slate-200 focus:border-brand-500'
                  }`}
                  {...register('password', { required: 'Password is required.' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  {...register('remember')}
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() =>
                  showToast('Password reset is not available in this demo yet.', 'info')
                }
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Demo credentials: ananya.sharma@student.edu / Student@123
          </p>
        </div>
      </div>
    </div>
  );
}
