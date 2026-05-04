// resources/js/Pages/Admin/Dashboard.jsx
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Shared/Layouts/AdminLayout';
import {
    BuildingOfficeIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    EyeIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#F97316', '#6366F1', '#14B8A6'];

export default function Dashboard({ overall, serviceRatings, charts = {} }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Provide safe defaults
    const safeCharts = {
        serviceDistribution: charts.serviceDistribution || [],
        monthlyTrend: charts.monthlyTrend || [],
        ageDistribution: charts.ageDistribution || [],
        clientTypeDistribution: charts.clientTypeDistribution || [],
        genderDistribution: charts.genderDistribution || [],
        regionDistribution: charts.regionDistribution || [],
        sqdSatisfaction: charts.sqdSatisfaction || [],
    };

    const metrics = [
        { icon: BuildingOfficeIcon, label: 'Departments', value: overall.total_departments, suffix: '', color: 'indigo', description: 'Active departments', bgGradient: 'from-indigo-50 to-indigo-100' },
        { icon: DocumentTextIcon, label: 'Transactions', value: overall.total_transactions, suffix: '', color: 'blue', description: 'All service transactions', bgGradient: 'from-blue-50 to-blue-100' },
        { icon: UserGroupIcon, label: 'Responses', value: overall.total_responses, suffix: '', color: 'purple', description: 'Completed surveys', bgGradient: 'from-purple-50 to-purple-100' },
        { icon: ChartBarIcon, label: 'Response Rate', value: overall.response_rate, suffix: '%', color: 'cyan', description: 'Across all departments', bgGradient: 'from-cyan-50 to-cyan-100' },
        { icon: CheckCircleIcon, label: 'CC Awareness', value: overall.cc_awareness, suffix: '%', color: 'green', description: 'Respondents who saw CC', bgGradient: 'from-green-50 to-green-100' },
        { icon: ArrowTrendingUpIcon, label: 'Overall Satisfaction', value: overall.overall_satisfaction, suffix: '%', color: 'rose', description: 'Average SQD score', bgGradient: 'from-rose-50 to-rose-100' },
    ];

    // Helper to render chart or empty state
    const renderChart = (title, chartKey, chartComponent, isEmpty) => {
        if (isEmpty) {
            return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No data available</p>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartComponent}
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout title="Admin Dashboard">
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Modern header with gradient background */}
               <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl shadow-xl p-8 text-white">
    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                                <p className="text-white mt-2">LGU‑wide performance overview & analytics</p>
                            </div>
                            <Link
                                href={route('admin.tracking')}
                                className="inline-flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-200 shadow-lg"
                            >
                                <EyeIcon className="h-5 w-5 mr-2" />
                                View Department Tracking
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-white text-sm mt-4">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Last updated: {new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Metrics Cards - modern glassmorphism style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                    {metrics.map((card, i) => {
                        const Icon = card.icon;
                        const textColor = `text-${card.color}-700`;
                        return (
                            <div
                                key={i}
                                className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${
                                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                                style={{ transitionDelay: `${i * 0.05}s`, transitionDuration: '0.3s' }}
                            >
                                <div className={`p-5 bg-gradient-to-br ${card.bgGradient}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Icon className={`h-6 w-6 ${textColor}`} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider bg-white/50 px-2 py-1 rounded-full">
                                            {card.label}
                                        </span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">{card.value}{card.suffix}</p>
                                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                                </div>
                                <div className="h-1 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:from-indigo-200 group-hover:via-indigo-400 group-hover:to-indigo-200 transition-all duration-500"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Grid - refined */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderChart(
                        'Service Distribution',
                        'serviceDistribution',
                        <BarChart data={safeCharts.serviceDistribution} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="count" fill="#3B82F6" radius={[0, 8, 8, 0]} />
                        </BarChart>,
                        safeCharts.serviceDistribution.length === 0
                    )}

                    {renderChart(
                        'Monthly Response Trend',
                        'monthlyTrend',
                        <LineChart data={safeCharts.monthlyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                            <Line type="monotone" dataKey="responses" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>,
                        safeCharts.monthlyTrend.length === 0
                    )}

                    {renderChart(
                        'Age Distribution',
                        'ageDistribution',
                        <BarChart data={safeCharts.ageDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                        </BarChart>,
                        safeCharts.ageDistribution.length === 0
                    )}

                    {renderChart(
                        'Client Type Distribution',
                        'clientType',
                        <PieChart>
                            <Pie
                                data={safeCharts.clientTypeDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="name"
                            >
                                {safeCharts.clientTypeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                        </PieChart>,
                        safeCharts.clientTypeDistribution.length === 0
                    )}

                    {renderChart(
                        'Gender Distribution',
                        'gender',
                        <PieChart>
                            <Pie
                                data={safeCharts.genderDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="name"
                            >
                                {safeCharts.genderDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                        </PieChart>,
                        safeCharts.genderDistribution.length === 0
                    )}

                    {renderChart(
                        'Top Regions',
                        'region',
                        <BarChart data={safeCharts.regionDistribution} layout="vertical" margin={{ left: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="count" fill="#F59E0B" radius={[0, 8, 8, 0]} />
                        </BarChart>,
                        safeCharts.regionDistribution.length === 0
                    )}

                    {renderChart(
                        'SQD Satisfaction (%) per Dimension',
                        'sqd',
                        <BarChart data={safeCharts.sqdSatisfaction} margin={{ bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="dimension" angle={-35} textAnchor="end" height={70} tick={{ fontSize: 10, fill: '#4b5563' }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="score" fill="#EF4444" radius={[8, 8, 0, 0]} />
                        </BarChart>,
                        safeCharts.sqdSatisfaction.length === 0
                    )}
                </div>

                {/* Service Ratings Table - modern card style */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-xl font-semibold text-gray-800">Service Satisfaction Ratings</h2>
                        <p className="text-sm text-gray-500 mt-1">Based on SQD responses (Agree + Strongly Agree) – higher is better</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction Rating (%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {serviceRatings?.map((service, idx) => (
                                    <tr key={service.name} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{service.category}</td>
                                        <td className="px-6 py-4 text-sm font-semibold">
                                            {service.rating !== null ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {service.rating}%
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No data</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!serviceRatings || serviceRatings.length === 0) && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                            <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                            No service rating data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
