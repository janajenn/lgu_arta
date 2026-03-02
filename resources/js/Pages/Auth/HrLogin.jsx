import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function HrLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (status?.includes('auth.failed')) {
            setLocalError('Invalid email or password.');
        }
    }, [status]);

    useEffect(() => {
        if ((data.email || data.password) && localError) {
            setLocalError('');
        }
    }, [data.email, data.password]);

    const submit = (e) => {
        e.preventDefault();
        setLocalError('');
        post('/hr/login', {
            onError: () => setLocalError('Invalid email or password.'),
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="HR Login" />

            {/* Main container */}
            <div className="flex min-h-screen bg-white">
                {/* Left side – brand image and quote (hidden on mobile) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-12">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 max-w-md text-center text-white">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                                <img
                                    src="/assets/hr.png"
                                    alt="HR logo"
                                    className="h-10 w-auto"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/logo.png';
                                    }}
                                />
                            </div>
                            <h2 className="text-4xl font-bold mb-4">HR Portal</h2>
                            <p className="text-xl text-blue-100">Manage employee wellbeing with PERMA insights</p>
                        </div>
                        <blockquote className="border-l-4 border-blue-300 pl-4 text-left italic text-blue-100">
                            "The happiness of your employees is the foundation of your company's success."
                        </blockquote>
                        <div className="mt-6 text-sm text-blue-200">– Workplace PERMA Profiler</div>
                    </div>
                </div>

                {/* Right side – login form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-md">
                        {/* Logo for mobile */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                                <img
                                    src="/assets/hr.png"
                                    alt="HR logo"
                                    className="h-8 w-auto brightness-0 invert"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/logo.png';
                                    }}
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                            <p className="text-gray-500 mt-1">Sign in to your HR account</p>
                        </div>

                        {/* Desktop heading */}
                        <div className="hidden lg:block mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                            <p className="text-gray-500 mt-2">Sign in to your HR account</p>
                        </div>

                        {/* Form card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            {localError && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    {localError}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                            placeholder="you@company.com"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                Forgot?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember me */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </form>

                            {/* Sign up link */}
                            <p className="mt-6 text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-blue-600 hover:text-blue-800 font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Footer note */}
                        <p className="mt-6 text-center text-xs text-gray-400">
                            By signing in, you agree to our Terms and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}