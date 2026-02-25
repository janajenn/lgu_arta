import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';

export default function Login({ status, canResetPassword, authError }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState(authError || '');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if ((data.email || data.password) && localError) {
            setLocalError('');
        }
    }, [data.email, data.password, localError]);

    useEffect(() => {
        if (status && (status.includes('auth.failed') || status.includes('Invalid credentials'))) {
            setLocalError('Invalid email or password.');
        }
    }, [status]);

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate floating particles
    const particles = useMemo(() => {
        const particleCount = 20;
        return Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
            color: `rgba(${59 + Math.random() * 40}, ${130 + Math.random() * 40}, ${246}, `,
            shape: Math.random() > 0.7 ? 'circle' : 'blob',
            delay: Math.random() * 5,
            wave: Math.random() * Math.PI * 2,
        }));
    }, []);

    const submit = (e) => {
        e.preventDefault();
        setLocalError('');
        
        post(route('login'), {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                if (errors.email || errors.password) {
                    setLocalError('Invalid email or password.');
                }
            },
            onFinish: () => {
                reset('password');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Sign In" />

            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 overflow-hidden">
                {/* Base gradient with parallax */}
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"
                    style={{
                        transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
                    }}
                />
                
                {/* Animated gradient waves */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-200/10 to-transparent animate-wave-1" />
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-200/10 to-transparent animate-wave-2" />
                </div>
                
                {/* Large floating orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-blue-200/10 rounded-full animate-float-orb-1 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-100/15 to-blue-200/5 rounded-full animate-float-orb-2 blur-3xl" />
                
                {/* Floating particles system */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className={`absolute ${particle.shape === 'blob' ? 'animate-blob' : 'rounded-full'}`}
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: `${particle.color}${particle.opacity})`,
                            boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px ${particle.color}${particle.opacity * 0.5})`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${10 + particle.speed * 10}s`,
                            transform: `translate(${mousePosition.x * particle.size * 2}px, ${mousePosition.y * particle.size * 2}px)`,
                        }}
                    />
                ))}
                
                {/* Geometric shapes */}
                <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-blue-200/30 rounded-lg animate-rotate-slow" />
                <div className="absolute bottom-1/3 left-1/4 w-8 h-8 border border-blue-200/20 rounded-full animate-rotate-medium" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-blue-200/15 rounded-full animate-pulse-slow" />
                
                {/* Subtle grid */}
                <div 
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `linear-gradient(90deg, #3b82f6 1px, transparent 1px),
                                         linear-gradient(180deg, #3b82f6 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        backgroundPosition: `${mousePosition.x * 20}px ${mousePosition.y * 20}px`,
                    }}
                />
                
                {/* Light beams */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-200/10 to-transparent animate-beam-1" />
                <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-200/5 to-transparent animate-beam-2" />
            </div>

            {/* Main Content */}
            <div className="relative w-full min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    {/* Logo with glow effect */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-white/90 backdrop-blur-sm border border-blue-100 shadow-lg relative">
                            <div className="absolute inset-0 bg-blue-100/20 rounded-xl animate-pulse-glow" />
                            <img 
                                src="\assets\hr.png" 
                                alt="HR Logo" 
                                className="h-10 w-auto relative z-10 transition-all duration-500 hover:scale-110 hover:rotate-6"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/logo.png';
                                }}
                            />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 animate-fade-in-down">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 animate-fade-in-down-delay">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Login Form with glass effect */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl shadow-blue-500/5 p-6 animate-scale-in">
                        {localError && (
                            <div className="mb-4 p-3 bg-red-50/90 backdrop-blur-sm border border-red-100 rounded-lg animate-shake">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2" />
                                    <p className="text-sm text-red-600">{localError}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email Field */}
                            <div className="group animate-slide-in" style={{ animationDelay: '0.1s' }}>
                                <label className="block text-sm text-gray-700 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300 z-10" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full h-10 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-300 relative z-10 bg-transparent"
                                        placeholder="you@company.com"
                                        autoFocus
                                    />
                                    {data.email && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-once" />
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password Field */}
                            <div className="group animate-slide-in" style={{ animationDelay: '0.2s' }}>
                                <div className="flex justify-between mb-1">
                                    <label className="block text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link 
                                            href={route('password.request')}
                                            className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline"
                                        >
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300 z-10" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full h-10 pl-9 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 hover:border-blue-300 relative z-10 bg-transparent"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-all duration-300 hover:bg-blue-50 z-10"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Remember Me */}
                            <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
                                <label className="flex items-center group cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-300 peer cursor-pointer"
                                        />
                                        <div className="absolute inset-0 bg-blue-500/10 rounded opacity-0 peer-checked:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute inset-0 scale-0 peer-checked:scale-100 transition-transform duration-300">
                                            <div className="w-full h-full border-2 border-blue-500 rounded" />
                                        </div>
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                                        Remember me
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 disabled:opacity-50 relative overflow-hidden group"
                                >
                                    {/* Button animations */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    {processing ? (
                                        <span className="relative flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="relative">Sign in</span>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 pt-4 border-t border-gray-100/50 text-center animate-slide-in" style={{ animationDelay: '0.5s' }}>
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-medium text-blue-600 hover:text-blue-800 transition-all duration-300 hover:underline hover:underline-offset-2"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center animate-slide-in" style={{ animationDelay: '0.6s' }}>
                        <p className="text-xs text-gray-400">
                            By signing in, you agree to our Terms and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>

            {/* Enhanced Custom CSS Animations */}
            <style jsx>{`
                @keyframes float-orb-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(40px, -30px) scale(1.1); }
                    50% { transform: translate(60px, 0) scale(1); }
                    75% { transform: translate(40px, 30px) scale(0.9); }
                }
                
                @keyframes float-orb-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-50px, -40px) scale(1.05); }
                    66% { transform: translate(-30px, 50px) scale(0.95); }
                }
                
                @keyframes blob {
                    0%, 100% { 
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
                        transform: translate(0, 0) rotate(0deg); 
                    }
                    25% { 
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; 
                        transform: translate(10px, -15px) rotate(90deg); 
                    }
                    50% { 
                        border-radius: 50% 60% 30% 60% / 60% 30% 70% 40%; 
                        transform: translate(20px, 0) rotate(180deg); 
                    }
                    75% { 
                        border-radius: 40% 60% 70% 30% / 60% 50% 30% 60%; 
                        transform: translate(10px, 15px) rotate(270deg); 
                    }
                }
                
                @keyframes wave-1 {
                    0%, 100% { transform: translateY(0) scaleY(1); }
                    50% { transform: translateY(-20px) scaleY(1.1); }
                }
                
                @keyframes wave-2 {
                    0%, 100% { transform: translateY(0) scaleY(1); }
                    50% { transform: translateY(20px) scaleY(1.1); }
                }
                
                @keyframes rotate-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes rotate-medium {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }
                
                @keyframes beam-1 {
                    0%, 100% { opacity: 0.1; transform: translateY(-100%); }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.1; transform: translateY(100%); }
                }
                
                @keyframes beam-2 {
                    0%, 100% { opacity: 0.05; transform: translateY(-100%); }
                    50% { opacity: 0.2; }
                    100% { opacity: 0.05; transform: translateY(100%); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }
                
                @keyframes ping-once {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
                
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes slide-in {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .animate-float-orb-1 {
                    animation: float-orb-1 25s ease-in-out infinite;
                }
                
                .animate-float-orb-2 {
                    animation: float-orb-2 30s ease-in-out infinite;
                    animation-delay: 5s;
                }
                
                .animate-blob {
                    animation: blob 20s ease-in-out infinite;
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                }
                
                .animate-wave-1 {
                    animation: wave-1 8s ease-in-out infinite;
                }
                
                .animate-wave-2 {
                    animation: wave-2 10s ease-in-out infinite;
                    animation-delay: 2s;
                }
                
                .animate-rotate-slow {
                    animation: rotate-slow 40s linear infinite;
                }
                
                .animate-rotate-medium {
                    animation: rotate-medium 25s linear infinite;
                }
                
                .animate-beam-1 {
                    animation: beam-1 8s linear infinite;
                }
                
                .animate-beam-2 {
                    animation: beam-2 12s linear infinite;
                    animation-delay: 3s;
                }
                
                .animate-pulse-glow {
                    animation: pulse-glow 4s ease-in-out infinite;
                }
                
                .animate-ping-once {
                    animation: ping-once 0.5s ease-out;
                }
                
                .animate-fade-in-down {
                    animation: fade-in-down 0.8s ease-out;
                }
                
                .animate-fade-in-down-delay {
                    animation: fade-in-down 0.8s ease-out 0.3s both;
                }
                
                .animate-scale-in {
                    animation: scale-in 0.6s ease-out;
                }
                
                .animate-slide-in {
                    animation: slide-in 0.5s ease-out both;
                }
            `}</style>
        </GuestLayout>
    );
}