// resources/js/Pages/Survey/ThankYou.jsx
import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SurveyThankYou() {
    const launchConfetti = () => {
        // Left side burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0, y: 0.6 },
            startVelocity: 25,
            colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444', '#3b82f6']
        });
        // Right side burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 1, y: 0.6 },
            startVelocity: 25,
            colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444', '#3b82f6']
        });
        // Additional burst in the center with more particles
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                startVelocity: 30,
                colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444', '#3b82f6']
            });
        }, 200);
    };

    useEffect(() => {
        launchConfetti();
    }, []);

    return (
        <>
            <Head title="Thank You" />

            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50">
                {/* Elegant background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl"></div>
                    <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl"></div>
                    <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-teal-100/30 blur-3xl"></div>
                    <svg className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2" width="800" height="800" viewBox="0 0 800 800" fill="none">
                        <circle cx="400" cy="400" r="400" fill="url(#gradient)" fillOpacity="0.1" />
                        <defs>
                            <radialGradient id="gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
                                <stop stopColor="#10B981" />
                                <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>

                <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
                    <div className="w-full max-w-2xl lg:max-w-3xl">
                        {/* Main content card */}
                        <div className="overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
                            <div className="px-6 py-12 sm:px-10 lg:px-12">
                                {/* Success icon with animated ring */}
                                <div className="mb-8 flex justify-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40"></div>
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg sm:h-24 sm:w-24">
                                            <svg className="h-10 w-10 text-white sm:h-12 sm:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Thank you message */}
                                <div className="text-center">
                                    <h1 className="mb-3 text-4xl font-light tracking-tight text-gray-900 sm:text-5xl">
                                        Thank You!
                                    </h1>
                                    <p className="mx-auto mb-6 max-w-xl text-lg text-gray-600">
                                        Your transaction has been successfully recorded. We truly appreciate your participation — it helps us serve you better.
                                    </p>
                                </div>

                                {/* Transaction details pill */}
                                <div className="mb-10 flex justify-center">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-medium">Transaction completed</span>
                                        <span className="text-emerald-500">•</span>
                                        <span className="text-emerald-600">{new Date().toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Next steps cards */}
                                <div className="mb-10">
                                    <h2 className="mb-6 text-center text-xl font-semibold text-gray-800">What happens next?</h2>
                                    <div className="grid gap-5 sm:grid-cols-3">
                                        <div className="group rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md">
                                            <div className="mb-3 flex justify-center">
                                                <svg className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <h3 className="mb-1 font-medium text-gray-900">Service Analysis</h3>
                                            <p className="text-sm text-gray-500">We analyze demand to improve service.</p>
                                        </div>
                                        <div className="group rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md">
                                            <div className="mb-3 flex justify-center">
                                                <svg className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                            </div>
                                            <h3 className="mb-1 font-medium text-gray-900">Resource Planning</h3>
                                            <p className="text-sm text-gray-500">We allocate resources based on volume.</p>
                                        </div>
                                        <div className="group rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md">
                                            <div className="mb-3 flex justify-center">
                                                <svg className="h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="mb-1 font-medium text-gray-900">Continuous Improvement</h3>
                                            <p className="text-sm text-gray-500">Your feedback drives better quality.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    {/* <Link
                                        href={route('public.departments')}
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Record Another Transaction
                                    </Link> */}
                                    <a
                                        href="/"
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Return Home
                                    </a>
                                </div>

                                {/* Celebrate again link */}
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={launchConfetti}
                                        className="inline-flex items-center gap-1 text-sm text-emerald-600 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-800"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Not enough confetti? Celebrate again!
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer contact */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                Need assistance? Contact HR at{' '}
                                <a href="mailto:hr-support@example.com" className="font-medium text-emerald-600 transition-colors hover:text-emerald-800 hover:underline">
                                    hrmo.opol@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}