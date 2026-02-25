import { Head, Link } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { BuildingOfficeIcon, UserIcon, EnvelopeIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ department }) {
    return (
        <DepartmentHeadLayout title={department.name}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route('department-head.departments.index')}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Departments
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                        <div className="flex items-center space-x-3">
                            <BuildingOfficeIcon className="h-10 w-10" />
                            <div>
                                <h1 className="text-2xl font-bold">{department.name}</h1>
                                <p className="text-blue-100 mt-1">
                                    Created on {department.created_at}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                                {department.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Department Head */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Department Head
                            </h2>
                            {department.head ? (
                                <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold">
                                        {department.head.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{department.head.name}</p>
                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                                            {department.head.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No department head assigned.</p>
                            )}
                        </div>

                        {/* Services */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Services Offered</h2>
                            {department.services.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {department.services.map((service) => (
                                        <div key={service.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h3 className="font-medium text-gray-900">{service.name}</h3>
                                            {service.description && (
                                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No services added for this department.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}