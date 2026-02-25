import { Head, Link } from '@inertiajs/react';
import { BuildingOfficeIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useMemo } from 'react';

// Enhanced color themes with more sophisticated gradients and hover states
const themes = [
    {
        topBar: 'from-blue-600 to-indigo-600',
        iconBg: 'from-blue-500 to-indigo-500',
        hoverText: 'group-hover:text-blue-600',
        focusRing: 'ring-blue-500',
        lightBg: 'bg-blue-50',
        borderGlow: 'group-hover:border-blue-200',
    },
    {
        topBar: 'from-emerald-600 to-teal-600',
        iconBg: 'from-emerald-500 to-teal-500',
        hoverText: 'group-hover:text-emerald-600',
        focusRing: 'ring-emerald-500',
        lightBg: 'bg-emerald-50',
        borderGlow: 'group-hover:border-emerald-200',
    },
    {
        topBar: 'from-violet-600 to-purple-600',
        iconBg: 'from-violet-500 to-purple-500',
        hoverText: 'group-hover:text-purple-600',
        focusRing: 'ring-purple-500',
        lightBg: 'bg-purple-50',
        borderGlow: 'group-hover:border-purple-200',
    },
    {
        topBar: 'from-amber-600 to-orange-600',
        iconBg: 'from-amber-500 to-orange-500',
        hoverText: 'group-hover:text-orange-600',
        focusRing: 'ring-orange-500',
        lightBg: 'bg-orange-50',
        borderGlow: 'group-hover:border-orange-200',
    },
    {
        topBar: 'from-rose-600 to-pink-600',
        iconBg: 'from-rose-500 to-pink-500',
        hoverText: 'group-hover:text-rose-600',
        focusRing: 'ring-rose-500',
        lightBg: 'bg-rose-50',
        borderGlow: 'group-hover:border-rose-200',
    },
    {
        topBar: 'from-cyan-600 to-sky-600',
        iconBg: 'from-cyan-500 to-sky-500',
        hoverText: 'group-hover:text-sky-600',
        focusRing: 'ring-sky-500',
        lightBg: 'bg-sky-50',
        borderGlow: 'group-hover:border-sky-200',
    },
];

export default function Departments({ departments }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState(departments);

    // Staggered entrance animation
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Real-time filtering with debounce for performance
    useEffect(() => {
        const timer = setTimeout(() => {
            const filtered = departments.filter(dept =>
                dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredDepartments(filtered);
        }, 300); // Debounce for smooth typing

        return () => clearTimeout(timer);
    }, [searchTerm, departments]);

    const clearSearch = () => setSearchTerm('');

    return (
        <>
            <Head title="Select Department" />

            {/* Refined hero section with floating elements and deeper gradient */}
            <div className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 py-20 sm:py-28 overflow-hidden isolate">
                {/* Animated orbs with softer colors and more movement */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-float-slower animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-glow"></div>
                </div>

                {/* Improved noise texture */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")` }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        Service Feedback Portal
                    </h1>
                    <p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
                        Please select the department you visited to share your experience. Your feedback helps us serve you better.
                    </p>
                </div>
            </div>

            {/* Main content area with search and department count */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Search and filter bar with glassmorphism effect */}
                <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            All Departments
                        </h2>
                        <span className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                            {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'}
                        </span>
                    </div>

                    {/* Search input with icon and clear button */}
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search departments..."
                            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                            aria-label="Search departments"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
 {/* Department grid – conditional rendering fixed */}
 {filteredDepartments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDepartments.map((dept, index) => {
                        const theme = themes[index % themes.length];
                        const delay = index * 100;
                        return (
                            <Link
                                key={dept.id}
                                href={route('public.department.show', dept.id)}
                                className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 ${theme.borderGlow} focus:outline-none focus:ring-2 ${theme.focusRing} focus:ring-offset-2 ${
                                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                } transition-all duration-700 ease-out`}
                                style={{ transitionDelay: `${delay}ms` }}
                            >
                                {/* Top bar */}
                                <div className={`h-2 bg-gradient-to-r ${theme.topBar} group-hover:opacity-90 transition-opacity`}></div>

                                <div className="p-8">
                                    <div className="flex items-start space-x-5">
                                        {/* Logo or fallback icon */}
                                        <div className="flex-shrink-0">
                                            {dept.logo ? (
                                                <img
                                                    src={dept.logo}
                                                    alt={dept.name}
                                                    className="w-14 h-14 rounded-xl object-contain bg-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${theme.iconBg} flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                                    <BuildingOfficeIcon className="w-7 h-7 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Text content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-xl font-bold text-gray-900 ${theme.hoverText} transition-colors truncate`}>
                                                {dept.name}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-500 flex items-center">
                                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                                                {dept.services_count} service{dept.services_count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {dept.description && (
                                        <div className="mt-5 relative">
                                            <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                                                {dept.description}
                                            </p>
                                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                                        </div>
                                    )}

                                    {/* Call to action */}
                                    <div className="mt-6 flex justify-end items-center space-x-2">
                                        <span className={`text-sm font-medium text-gray-400 ${theme.hoverText} transition-colors`}>
                                            Select department
                                        </span>
                                        <svg
                                            className={`w-5 h-5 text-gray-400 ${theme.hoverText} group-hover:translate-x-2 transition-all duration-300`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Glow effect */}
                                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${theme.iconBg} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl blur-2xl`}></div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                // Empty state
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-inner">
                    <BuildingOfficeIcon className="mx-auto h-24 w-24 text-gray-300 animate-float-slow" />
                    <h3 className="mt-6 text-2xl font-semibold text-gray-900">No departments found</h3>
                    <p className="mt-2 text-gray-500 text-lg max-w-md mx-auto">
                        {searchTerm ? `No departments matching "${searchTerm}"` : 'Please check back later or contact support.'}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            )}
        </div>
            {/* Polished footer with gradient line */}
            <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p className="flex items-center gap-1">
                            Developed with <span className="text-red-500 animate-heartbeat">❤</span> by{' '}
                            <span className="font-semibold text-gray-700 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">HRMO Interns</span>
                        </p>
                        <p className="mt-2 md:mt-0">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Enhanced custom animations */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    25% { transform: translate(5%, 5%) scale(1.05); opacity: 0.4; }
                    50% { transform: translate(10%, -5%) scale(1.1); opacity: 0.5; }
                    75% { transform: translate(-5%, -10%) scale(1.05); opacity: 0.4; }
                }
                @keyframes float-slower {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    25% { transform: translate(-5%, -5%) scale(1.05); opacity: 0.4; }
                    50% { transform: translate(-10%, 5%) scale(1.1); opacity: 0.5; }
                    75% { transform: translate(5%, 10%) scale(1.05); opacity: 0.4; }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(1.2); }
                }
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.1); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.1); }
                }
                .animate-float-slow {
                    animation: float-slow 12s ease-in-out infinite;
                }
                .animate-float-slower {
                    animation: float-slower 16s ease-in-out infinite;
                }
                .animate-pulse-glow {
                    animation: pulse-glow 8s ease-in-out infinite;
                }
                .animate-heartbeat {
                    animation: heartbeat 1.5s ease-in-out infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
}