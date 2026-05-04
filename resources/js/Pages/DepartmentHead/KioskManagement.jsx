import { Head, Link, router } from '@inertiajs/react';
import DepartmentHeadLayout from '../../Shared/Layouts/DepartmentHeadLayout';
import { useState } from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function KioskManagement({ department, activeSession, sessions }) {
    const [activating, setActivating] = useState(false);
    const [deactivating, setDeactivating] = useState(false);

    const activateKiosk = async () => {
    setActivating(true);
    try {
        const response = await axios.post(route('department-head.kiosk.activate'));
        if (response.data.success) {
            localStorage.setItem('kiosk_token', response.data.token);
            // Redirect to the department survey page
            window.location.href = route('public.department.show', department.id);
        } else {
            alert(response.data.error || 'Activation failed');
        }
    } catch (error) {
        alert(error.response?.data?.error || 'Activation failed');
    } finally {
        setActivating(false);
    }
};

    const deactivateKiosk = () => {
        setDeactivating(true);
        router.post(route('department-head.kiosk.deactivate'), {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setDeactivating(false),
        });
    };

    return (
        <DepartmentHeadLayout title="Kiosk Management">
            <Head title="Kiosk Management" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Kiosk Session Management</h1>
                    <div className="text-sm text-gray-500">
                        {department.opening_time && department.closing_time ? (
                            <span>Operating hours: {department.opening_time} – {department.closing_time}</span>
                        ) : (
                            <span>No operating hours set</span>
                        )}
                    </div>
                </div>

                {/* Current Session Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Session</h2>
                    {activeSession ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircleIcon className="h-6 w-6" />
                                <span className="font-medium">Active</span>
                            </div>
                            <p><strong>Activated:</strong> {new Date(activeSession.activated_at).toLocaleString()}</p>
                            <p><strong>Expires:</strong> {new Date(activeSession.expires_at).toLocaleString()}</p>
                            <p><strong>Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{activeSession.token}</code></p>
                            <button
                                onClick={deactivateKiosk}
                                disabled={deactivating}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {deactivating ? 'Deactivating...' : 'Deactivate Session'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-500">
                                <XCircleIcon className="h-6 w-6" />
                                <span>No active session</span>
                            </div>
                            <button
                                onClick={activateKiosk}
                                disabled={activating}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {activating ? 'Activating...' : 'Activate Kiosk Session'}
                            </button>
                        </div>
                    )}
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-800">Session History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activated At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expired At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activated By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deactivated By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sessions.map(session => (
                                    <tr key={session.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm">{new Date(session.activated_at).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm">{session.expires_at ? new Date(session.expires_at).toLocaleString() : '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${session.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {session.is_active ? 'Active' : 'Ended'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{session.activated_by?.name || '-'}</td>
                                        <td className="px-6 py-4 text-sm">{session.deactivated_by?.name || '-'}</td>
                                    </tr>
                                ))}
                                {sessions.length === 0 && (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No sessions recorded.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
