import { Head, Link, router, usePage } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { BuildingOfficeIcon, EyeIcon, PencilIcon, ArrowTopRightOnSquareIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Index({ departments }) {
    const { auth } = usePage().props;
    const isHR = auth.user?.is_hr_department; // true if current user is HR

    const handleRowClick = (deptId) => {
        router.get(route('department-head.dashboard.show', deptId));
    };

    return (
        <DepartmentHeadLayout title="Departments">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">All Departments</h2>
                    <Link
                        href={route('department-head.departments.create')}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                    >
                        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                        New Department
                    </Link>
                </div>

                {/* Info message – shown to everyone, but clarifies who can click */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center">
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                    {isHR
                        ? 'Click any department row to view its dashboard and analytics.'
                        : 'Only HR users can click to view department dashboards.'}
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focal Person</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {departments.map((dept) => (
                                <tr
                                    key={dept.id}
                                    className={`transition-colors ${isHR ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                    onClick={isHR ? () => handleRowClick(dept.id) : undefined}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 flex items-center">
                                            {dept.name}
                                            {!isHR && (
                                                <LockClosedIcon className="h-4 w-4 ml-2 text-gray-400" title="Only HR can access dashboard" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{dept.description || '—'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {dept.head_name ? (
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{dept.head_name}</div>
                                                <div className="text-sm text-gray-500">{dept.head_email}</div>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">Not assigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 cursor-default"
                                            title={`Internal: ${dept.internal_services_count}, External: ${dept.external_services_count}`}
                                        >
                                            {dept.services_count} services
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {dept.created_at}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                                            <Link
                                                href={route('department-head.departments.show', dept.id)}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-900"
                                            >
                                                <EyeIcon className="h-4 w-4 mr-1" />
                                                View
                                            </Link>
                                            <Link
                                                href={route('department-head.departments.edit', dept.id)}
                                                className="inline-flex items-center text-amber-600 hover:text-amber-900"
                                            >
                                                <PencilIcon className="h-4 w-4 mr-1" />
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {departments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No departments created yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
