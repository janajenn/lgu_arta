import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PinVerificationModal from '@/Components/PinVerificationModal';
import Swal from 'sweetalert2';
import {
    HomeIcon,
    ChartBarIcon,
    BuildingOfficeIcon,
    DocumentTextIcon,
    MapPinIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function DepartmentHeadLayout({ children, title = null }) {
    const { auth, viewingDepartment } = usePage().props; // 👈 get viewingDepartment from props
    const user = auth.user;
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [pinModalOpen, setPinModalOpen] = useState(false);

    const isViewingMode = !!viewingDepartment; // true if we are looking at another department's dashboard

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

    // Build navigation items based on viewing mode
    const navigation = [
        {
            name: 'Dashboard',
            href: isViewingMode
                ? route('department-head.dashboard.show', viewingDepartment.id)
                : route('department-head.dashboard'),
            icon: HomeIcon,
        },
        {
            name: 'Analytics',
            href: isViewingMode
                ? route('department-head.analytics.show', viewingDepartment.id)
                : route('department-head.analytics'),
            icon: ChartBarIcon,
        },
    ];

    // Add HR‑specific items only when NOT in viewing mode
    if (!isViewingMode && user?.is_hr_department) {
        navigation.push(
            {
                name: 'Departments',
                href: route('department-head.departments.index'),
                icon: BuildingOfficeIcon,
            },
            {
                name: 'Overall Reports',
                href: route('department-head.reports.index'),
                icon: DocumentTextIcon,
            },
            {
                name: 'Track Departments',
                action: () => setPinModalOpen(true),
                icon: MapPinIcon,
            }
        );
    }

    // Add active state
    const navWithActive = navigation.map((item) => {
        if (item.href) {
            return { ...item, current: isActive(item.href) };
        }
        return { ...item, current: false };
    });

    const currentPage = title || navWithActive.find((item) => item.current)?.name || 'Dashboard';

    return (
        <>
            <Head title={`${currentPage} - Department Head`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Fixed Top Navigation Bar - Modern Glass */}
                <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-white/20 z-30 shadow-sm">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {/* Mobile sidebar toggle */}
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 transition-all duration-200"
                                >
                                    <Bars3Icon className="h-6 w-6" />
                                </button>

                                <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                                    <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-xl font-semibold text-slate-800 ml-3 tracking-tight">
                                        ARTA Survey Monitor
                                    </h1>
                                </div>
                            </div>

                            {/* User Profile */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    {auth.user.department_name && (
                                        <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                            {auth.user.department_name}
                                        </span>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium shadow-md">
                                            <span className="text-sm">{auth.user.name.charAt(0)}</span>
                                        </div>
                                        <span className="hidden md:block text-sm font-medium text-slate-700">
                                            {auth.user.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl transition-all duration-200"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
                                        <span className="hidden md:inline">Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Fixed Sidebar - Modern Glass */}
                <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 z-20 shadow-xl">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto py-8 px-4">
                            <nav className="space-y-2">
                                {navWithActive.map((item) =>
                                    item.action ? (
                                        <button
                                            key={item.name}
                                            onClick={item.action}
                                            className={`group relative flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                                item.current
                                                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                                            }`}
                                        >
                                            {item.current && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full shadow-lg shadow-emerald-500/30" />
                                            )}
                                            <item.icon
                                                className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                                                    item.current ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                                                }`}
                                            />
                                            {item.name}
                                        </button>
                                    ) : (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                                item.current
                                                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                                    : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                                            }`}
                                        >
                                            {item.current && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full shadow-lg shadow-emerald-500/30" />
                                            )}
                                            <item.icon
                                                className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                                                    item.current ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                                                }`}
                                            />
                                            {item.name}
                                        </Link>
                                    )
                                )}
                            </nav>
                        </div>

                        {/* User Profile Footer */}
                        <div className="flex-shrink-0 border-t border-slate-200/50 p-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                                    <span className="text-sm font-medium">{auth.user.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate">{auth.user.name}</p>
                                    <p className="text-xs text-slate-500">Focal Person</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile sidebar overlay - Modern */}
                {sidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 flex">
                        <div
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/90 backdrop-blur-xl shadow-2xl">
                            <div className="absolute top-0 right-0 -mr-12 pt-4">
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg text-slate-600 hover:text-slate-900"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex-shrink-0 flex items-center px-4 space-x-2">
                                    <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-xl font-semibold text-slate-800">ARTA Survey</h1>
                                </div>
                                <nav className="mt-6 px-2 space-y-1">
                                    {navWithActive.map((item) =>
                                        item.action ? (
                                            <button
                                                key={item.name}
                                                onClick={() => {
                                                    setSidebarOpen(false);
                                                    item.action();
                                                }}
                                                className={`group flex items-center px-4 py-3 text-base font-medium rounded-xl w-full text-left transition-all duration-200 ${
                                                    item.current
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                                                }`}
                                            >
                                                <item.icon
                                                    className={`mr-3 h-6 w-6 ${
                                                        item.current ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                                                    }`}
                                                />
                                                {item.name}
                                            </button>
                                        ) : (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`group flex items-center px-4 py-3 text-base font-medium rounded-xl ${
                                                    item.current
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                                                }`}
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <item.icon
                                                    className={`mr-3 h-6 w-6 ${
                                                        item.current ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                                                    }`}
                                                />
                                                {item.name}
                                            </Link>
                                        )
                                    )}
                                </nav>
                            </div>
                            <div className="flex-shrink-0 border-t border-slate-200/50 p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                                        <span className="text-sm font-medium">{auth.user.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-slate-800">{auth.user.name}</div>
                                        <div className="text-sm text-slate-500">Focal Person</div>
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
                                <nav className="flex items-center space-x-2 text-sm text-slate-500">
                                    <Link
                                        href={route('department-head.dashboard')}
                                        className="hover:text-slate-700 transition-colors duration-200"
                                    >
                                        Focal Person
                                    </Link>
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="font-medium text-slate-700">{currentPage}</span>
                                </nav>
                            </div>

                            {/* Content card - Clean Glass */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>

                {viewingDepartment && (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-100 p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-emerald-700">Viewing mode</span>
                </div>
                <button
                    onClick={() => {
                        // Hide for this session – you could also use localStorage
                        // but simple state is enough
                        setShowFloater(false);
                    }}
                    className="h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p className="text-sm text-gray-700">
                You are currently viewing the dashboard for <span className="font-semibold text-emerald-700">{viewingDepartment.name}</span>.
            </p>
            <Link
                href={route('department-head.dashboard')}
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
            >
                ← Return to HRMO Dashboard
            </Link>
        </div>
    </div>
)}

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
