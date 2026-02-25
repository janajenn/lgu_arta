import DepartmentHeadLayout from '@/Shared/Layouts/DepartmentHeadLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Reports({ respondents, summary }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceFilter, setServiceFilter] = useState('');
    const [clientTypeFilter, setClientTypeFilter] = useState('');

    // Filter respondents
    const filteredRespondents = respondents.data.filter(respondent => {
        const matchesSearch = 
            respondent.id.toString().includes(searchTerm) ||
            respondent.service_availed.toLowerCase().includes(searchTerm.toLowerCase()) ||
            respondent.region_of_residence.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesService = !serviceFilter || respondent.service_availed === serviceFilter;
        const matchesClientType = !clientTypeFilter || respondent.client_type === clientTypeFilter;
        
        return matchesSearch && matchesService && matchesClientType;
    });

    // Get unique services and client types for filters
    const services = [...new Set(respondents.data.map(r => r.service_availed))];
    const clientTypes = ['citizen', 'business', 'government'];

    return (
        <DepartmentHeadLayout>
            <Head title="Reports" />
            
            <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                    {Object.entries(summary).map(([key, value]) => (
                        <div key={key} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 capitalize">
                                                {key.replace('_', ' ')}
                                            </dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {value}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search by ID, service, or region..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Service
                            </label>
                            <select
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Services</option>
                                {services.map(service => (
                                    <option key={service} value={service}>
                                        {service}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client Type
                            </label>
                            <select
                                value={clientTypeFilter}
                                onChange={(e) => setClientTypeFilter(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Types</option>
                                {clientTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Link
                                href={route('department-head.export', 'csv')}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export CSV
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Respondents Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service Availed
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date of Transaction
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Region
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Age/Sex
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredRespondents.map((respondent) => (
                                    <tr key={respondent.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{respondent.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                            {respondent.client_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {respondent.service_availed}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(respondent.date_of_transaction).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {respondent.region_of_residence}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {respondent.age}/{respondent.sex.charAt(0).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(respondent.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {respondents.links && respondents.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <nav className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <Link
                                        href={respondents.prev_page_url}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                            respondents.prev_page_url 
                                                ? 'text-gray-700 bg-white hover:bg-gray-50' 
                                                : 'text-gray-300 bg-gray-50 cursor-not-allowed'
                                        }`}
                                    >
                                        Previous
                                    </Link>
                                    <Link
                                        href={respondents.next_page_url}
                                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                                            respondents.next_page_url 
                                                ? 'text-gray-700 bg-white hover:bg-gray-50' 
                                                : 'text-gray-300 bg-gray-50 cursor-not-allowed'
                                        }`}
                                    >
                                        Next
                                    </Link>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{respondents.from}</span> to{' '}
                                            <span className="font-medium">{respondents.to}</span> of{' '}
                                            <span className="font-medium">{respondents.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {respondents.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${index === 0 ? 'rounded-l-md' : ''} ${
                                                        index === respondents.links.length - 1 ? 'rounded-r-md' : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}