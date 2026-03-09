import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { HomeIcon, ChartBarIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import Swal from 'sweetalert2';

export default function AdminLayout({ children, title = null }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Confirm Logout',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        background: '#fff',
        backdrop: true,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            router.post(route('logout'));
        }
    });
};

    const isActive = (href) => {
        if (!mounted) return false;
        const currentPath = url.split('?')[0];
        const itemPath = href.split('?')[0];
        return currentPath === itemPath;
    };

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
        { name: 'Reports', href: route('admin.reports.index'), icon: ChartBarIcon },
    ];

    const navWithActive = navigation.map(item => ({
        ...item,
        current: isActive(item.href)
    }));

    const currentPage = title || navWithActive.find(item => item.current)?.name || 'Dashboard';

    return (
        <>
            <Head title={`${currentPage} - Admin`} />

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
                                    <Bars3Icon className="h-6 w-6" />
                                </button>

                                <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-xl font-semibold text-gray-800 ml-2 tracking-tight">
                                        ARTA Admin
                                    </h1>
                                </div>
                            </div>

                            {/* User Profile */}
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                                                <span className="text-sm">{user.name.charAt(0)}</span>
                                            </div>
                                            <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-colors duration-200"
                                        >
                                            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1.5" />
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
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            item.current
                                                ? 'bg-indigo-500/20 text-indigo-700'
                                                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                        }`}
                                    >
                                        {item.current && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-lg shadow-indigo-500/30" />
                                        )}
                                        <item.icon
                                            className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                                                item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 border-t border-white/20 p-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                    <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
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
                                    <XMarkIcon className="h-6 w-6 text-white" />
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex-shrink-0 flex items-center px-4 space-x-2">
                                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-xl font-semibold text-gray-800">ARTA Admin</h1>
                                </div>
                                <nav className="mt-5 px-2 space-y-1">
                                    {navWithActive.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                                item.current
                                                    ? 'bg-indigo-500/20 text-indigo-700'
                                                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                            }`}
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <item.icon
                                                className={`mr-4 h-6 w-6 ${
                                                    item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
                                                }`}
                                            />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            <div className="flex-shrink-0 flex border-t border-white/20 p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                        <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm text-gray-500">Administrator</div>
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
                                        href={route('admin.dashboard')}
                                        className="hover:text-gray-700 transition-colors duration-200"
                                    >
                                        Admin
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
            </div>
        </>
    );
}
