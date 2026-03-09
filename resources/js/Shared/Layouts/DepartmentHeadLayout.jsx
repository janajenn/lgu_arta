import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PinVerificationModal from '@/Components/PinVerificationModal'; // adjust path as needed

export default function DepartmentHeadLayout({ children, title = null }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pinModalOpen, setPinModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const isActive = (href) => {
        if (!mounted) return false;
        const currentPath = url.split('?')[0];
        const itemPath = href.split('?')[0];
        return currentPath === itemPath;
    };

    // Base navigation items
    const navigation = [
        { name: 'Dashboard for HRMO', href: route('department-head.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Analytics for HRMO', href: route('department-head.analytics'), icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
        { name: 'Departments', href: route('department-head.departments.index'), icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'Overall Reports', href: route('department-head.reports.index'), icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    // Add Track Departments only for HR users
    if (user?.is_hr_department) {
        navigation.push({
            name: 'Track Departments',
            action: () => setPinModalOpen(true),
            icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
        });
    }

    // Add active state based on current URL (for href items only)
    const navWithActive = navigation.map(item => {
        if (item.href) {
            return { ...item, current: isActive(item.href) };
        }
        return { ...item, current: false };
    });

    const currentPage = title || navWithActive.find(item => item.current)?.name || 'Dashboard';

    return (
        <>
            <Head title={`${currentPage} - Department Head`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Fixed Top Navigation Bar - Glassmorphism */}
                <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md border-b border-white/20 z-30 shadow-lg">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {/* Mobile sidebar toggle */}
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-colors duration-200"
                                >
                                    <span className="sr-only">Open sidebar</span>
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>

                                <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                                    <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-xl font-semibold text-gray-800 ml-2 tracking-tight">
                                        ARTA Survey Monitor
                                    </h1>
                                </div>
                            </div>

                            {/* User Profile */}
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="flex items-center space-x-3">
                                        {auth.user.department_name && (
                                            <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                {auth.user.department_name}
                                            </span>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
                                                <span className="text-sm">{auth.user.name.charAt(0)}</span>
                                            </div>
                                            <span className="hidden md:block text-sm font-medium text-gray-700">{auth.user.name}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-colors duration-200"
                                        >
                                            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span className="hidden md:inline">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Fixed Sidebar - Glassmorphism */}
                <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white/70 backdrop-blur-md border-r border-white/20 z-20 shadow-xl">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto py-6">
                            <nav className="px-3 space-y-1">
                                {navWithActive.map((item) => (
                                    item.action ? (
                                        <button
                                            key={item.name}
                                            onClick={item.action}
                                            className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full text-left transition-all duration-200 ${
                                                item.current
                                                    ? 'bg-emerald-500/20 text-emerald-700'
                                                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                            }`}
                                        >
                                            {item.current && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/30" />
                                            )}
                                            <svg
                                                className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                                                    item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                            </svg>
                                            {item.name}
                                        </button>
                                    ) : (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                item.current
                                                    ? 'bg-emerald-500/20 text-emerald-700'
                                                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                            }`}
                                        >
                                            {item.current && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/30" />
                                            )}
                                            <svg
                                                className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                                                    item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                            </svg>
                                            {item.name}
                                        </Link>
                                    )
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 border-t border-white/20 p-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                                    <span className="text-sm font-medium">{auth.user.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">Department Head</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile sidebar overlay - Glassmorphism */}
                {sidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 flex">
                        <div
                            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/80 backdrop-blur-md shadow-xl">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex-shrink-0 flex items-center px-4 space-x-2">
                                    <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-xl font-semibold text-gray-800">ARTA Survey</h1>
                                </div>
                                <nav className="mt-5 px-2 space-y-1">
                                    {navWithActive.map((item) => (
                                        item.action ? (
                                            <button
                                                key={item.name}
                                                onClick={() => {
                                                    setSidebarOpen(false);
                                                    item.action();
                                                }}
                                                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full text-left ${
                                                    item.current
                                                        ? 'bg-emerald-500/20 text-emerald-700'
                                                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                                }`}
                                            >
                                                <svg
                                                    className={`mr-4 h-6 w-6 ${
                                                        item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                </svg>
                                                {item.name}
                                            </button>
                                        ) : (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                                    item.current
                                                        ? 'bg-emerald-500/20 text-emerald-700'
                                                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                                }`}
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <svg
                                                    className={`mr-4 h-6 w-6 ${
                                                        item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                </svg>
                                                {item.name}
                                            </Link>
                                        )
                                    ))}
                                </nav>
                            </div>
                            <div className="flex-shrink-0 flex border-t border-white/20 p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
                                        <span className="text-sm font-medium">{auth.user.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-gray-800">{auth.user.name}</div>
                                        <div className="text-sm text-gray-500">Department Head</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="pt-16 lg:ml-64 min-h-screen">
                    <div className="py-8 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Breadcrumb */}
                            <div className="mb-8">
                                <nav className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Link
                                        href={route('department-head.dashboard')}
                                        className="hover:text-gray-700 transition-colors duration-200"
                                    >
                                        Department Head
                                    </Link>
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{currentPage}</span>
                                </nav>
                            </div>

                            {/* Content card - Glassmorphism */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>

                {/* PIN Verification Modal */}
                <PinVerificationModal
                    isOpen={pinModalOpen}
                    onClose={() => setPinModalOpen(false)}
                    onSuccess={() => {
                        router.get(route('department-head.track-departments'));
                    }}
                />
            </div>
        </>
    );
}
