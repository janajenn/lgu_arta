import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import {
    BuildingOfficeIcon,
    UserIcon,
    EnvelopeIcon,
    ArrowLeftIcon,
    CalendarIcon,
    DocumentTextIcon,
    SparklesIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function Show({ department }) {
    const getCategoryBadge = (category) => {
        return category === 'internal'
            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50'
            : 'bg-violet-50 text-violet-700 ring-1 ring-violet-200/50';
    };

    const serviceCount = department.services.length;
    const internalCount = department.services.filter(s => s.category === 'internal').length;
    const externalCount = serviceCount - internalCount;

    return (
        <DepartmentHeadLayout title={department.name}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button - minimal */}
                <div className="mb-6">
                    <Link
                        href={route('department-head.departments.index')}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors group"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                        Back to departments
                    </Link>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/70 overflow-hidden">
                    {/* Header - compact gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center gap-4">
                        {/* Logo/icon */}
                        <div className="flex-shrink-0">
                            {department.logo ? (
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
                                    <img
                                        src={`/storage/${department.logo}`}
                                        alt={department.name}
                                        className="h-12 w-12 object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
                                    <BuildingOfficeIcon className="h-12 w-12 text-white/90" />
                                </div>
                            )}
                        </div>

                        {/* Title and meta */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-white truncate">{department.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-indigo-100 mt-1">
                                <span className="flex items-center">
                                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                    {department.created_at}
                                </span>
                                {serviceCount > 0 && (
                                    <span className="flex items-center">
                                        <SparklesIcon className="h-3.5 w-3.5 mr-1" />
                                        {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quick edit link */}
                        <Link
                            href={route('department-head.departments.edit', department.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Edit
                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                    </div>

                    {/* Content grid */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left column: description + head */}
                            <div className="lg:col-span-1 space-y-5">
                                {/* Description card */}
                                <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-100">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                                        <DocumentTextIcon className="h-4 w-4 mr-1 text-gray-400" />
                                        About
                                    </h2>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {department.description || (
                                            <span className="text-gray-400 italic">No description provided.</span>
                                        )}
                                    </p>
                                </div>

                                {/* Department head card */}
                                <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-100">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                                        <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                                        Department Head
                                    </h2>
                                    {department.head ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                                {department.head.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {department.head.name}
                                                </p>
                                                <a
                                                    href={`mailto:${department.head.email}`}
                                                    className="text-xs text-gray-500 hover:text-indigo-600 flex items-center mt-0.5 truncate"
                                                >
                                                    <EnvelopeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                    {department.head.email}
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">Not assigned</p>
                                    )}
                                </div>

                                {/* Quick stats */}
                                <div className="bg-gray-50/70 rounded-xl p-5 border border-gray-100">
                                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Breakdown</h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Internal</span>
                                            <span className="text-sm font-medium text-gray-900">{internalCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">External</span>
                                            <span className="text-sm font-medium text-gray-900">{externalCount}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200 mt-2 flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Total</span>
                                            <span className="text-sm font-bold text-gray-900">{serviceCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column: services */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center">
                                        <BuildingOfficeIcon className="h-4 w-4 mr-1 text-gray-400" />
                                        Services
                                    </h2>
                                    <span className="text-xs text-gray-500">{serviceCount} total</span>
                                </div>

                                {serviceCount > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {department.services.map((service) => (
                                            <div
                                                key={service.id}
                                                className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all hover:border-indigo-200"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {service.name}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryBadge(service.category)}`}>
                                                        {service.category}
                                                    </span>
                                                </div>
                                                {service.description && (
                                                    <p className="text-xs text-gray-500 line-clamp-2">
                                                        {service.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-8 text-center">
                                        <BuildingOfficeIcon className="h-8 w-8 mx-auto text-gray-300" />
                                        <p className="mt-2 text-sm text-gray-400">No services added</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-xs text-gray-400">
                    Department ID: {department.id}
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}