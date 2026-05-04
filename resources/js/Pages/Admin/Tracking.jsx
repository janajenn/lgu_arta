import { Head } from '@inertiajs/react';
import AdminLayout from '../../Shared/Layouts/AdminLayout';
import { BuildingOfficeIcon, MagnifyingGlassIcon, CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Tracking({ departments }) {
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = departments.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AdminLayout title="Department Tracking">
            <Head title="Department Tracking" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Department Tracking</h1>
                        <p className="text-gray-600">Monitor each department’s survey response progress</p>
                    </div>
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border rounded-lg focus:ring-indigo-500 w-64"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map(dept => {
                        const progress = dept.min_required > 0 ? Math.min((dept.total_responses / dept.min_required) * 100, 100) : 0;
                        const progressColor = progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500';
                        return (
                            <div key={dept.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
                                {/* same card content as before – copied from old admin dashboard */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold">
                                            {dept.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{dept.name}</h3>
                                            <p className="text-xs text-gray-500">{dept.services_count} services</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${dept.status === 'met' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {dept.status === 'met' ? 'Met' : 'Below Min'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 my-4">
                                    <div className="bg-gray-50 p-2 rounded text-center"><div className="font-bold">{dept.total_transactions}</div><div className="text-xs">Transactions</div></div>
                                    <div className="bg-gray-50 p-2 rounded text-center"><div className="font-bold">{dept.total_responses}</div><div className="text-xs">Responses</div></div>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <div className="flex justify-between text-xs"><span>Min required: {dept.min_required}</span><span>{Math.round(progress)}%</span></div>
                                    <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${progress}%` }}></div></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Response rate: {dept.response_rate}%</span>
                                    {dept.total_responses >= dept.min_required ? <span className="text-green-600">✓ Target met</span> : <span className="text-red-600">{dept.min_required - dept.total_responses} more needed</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
