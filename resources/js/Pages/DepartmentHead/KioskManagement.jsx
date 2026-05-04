import { Head, Link, router } from '@inertiajs/react';
import DepartmentHeadLayout from '../../Shared/Layouts/DepartmentHeadLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    PlayIcon,
    StopIcon,
    ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';

export default function KioskManagement({ department, activeSession, sessions }) {
    const [activating, setActivating] = useState(false);
    const [deactivating, setDeactivating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Auto-clear messages after 4 seconds
    useEffect(() => {
        if (errorMsg || successMsg) {
            const timer = setTimeout(() => {
                setErrorMsg(null);
                setSuccessMsg(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMsg, successMsg]);

    const activateKiosk = async () => {
        setActivating(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            const response = await axios.post(route('department-head.kiosk.activate'));
            if (response.data.success) {
                localStorage.setItem('kiosk_token', response.data.token);
                setSuccessMsg('Kiosk session activated! Redirecting...');
                // Short delay to show success message before redirect
                setTimeout(() => {
                    window.location.href = route('public.department.show', department.id);
                }, 1000);
            } else {
                setErrorMsg(response.data.error || 'Activation failed');
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.error || 'Activation failed');
        } finally {
            setActivating(false);
        }
    };

    const deactivateKiosk = () => {
        setDeactivating(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        router.post(route('department-head.kiosk.deactivate'), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMsg('Kiosk session deactivated successfully');
                setTimeout(() => setSuccessMsg(null), 3000);
            },
            onError: (err) => {
                setErrorMsg(err.response?.data?.error || 'Deactivation failed');
            },
            onFinish: () => setDeactivating(false),
        });
    };

    const copyToken = (token) => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate progress percentage for active session
    const getExpiryProgress = () => {
        if (!activeSession) return 0;
        const now = new Date();
        const activated = new Date(activeSession.activated_at);
        const expires = new Date(activeSession.expires_at);
        const total = expires - activated;
        const elapsed = now - activated;
        if (total <= 0) return 0;
        const percent = (elapsed / total) * 100;
        return Math.min(100, Math.max(0, percent));
    };

    const expiryProgress = getExpiryProgress();

    return (
        <DepartmentHeadLayout title="Kiosk Management">
            <Head title="Kiosk Management" />

            <div className="space-y-8">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kiosk Session Management</h1>
                            <p className="text-indigo-100 mt-1">Control and monitor the feedback kiosk for this department</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                            {department.opening_time && department.closing_time ? (
                                <span>🕒 Operating hours: {department.opening_time} – {department.closing_time}</span>
                            ) : (
                                <span>⚙️ No operating hours set</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Toast messages */}
                {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700">{errorMsg}</p>
                        </div>
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                            <p className="text-green-700">{successMsg}</p>
                        </div>
                    </div>
                )}

                {/* Current Session Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <ClockIcon className="h-5 w-5 text-indigo-500" />
                            Current Session
                        </h2>
                    </div>
                    <div className="p-6">
                        {activeSession ? (
                            <div className="space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircleIcon className="h-6 w-6" />
                                        <span className="font-semibold">Active</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Token expires in: {new Date(activeSession.expires_at).toLocaleString()}
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Session progress</span>
                                        <span>{Math.round(expiryProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${expiryProgress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                                    <div>
                                        <span className="text-gray-500">Activated at</span>
                                        <p className="font-medium">{new Date(activeSession.activated_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Expires at</span>
                                        <p className="font-medium">{new Date(activeSession.expires_at).toLocaleString()}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-gray-500">Session token</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="bg-white px-2 py-1 rounded text-sm font-mono border break-all flex-1">
                                                {activeSession.token}
                                            </code>
                                            <button
                                                onClick={() => copyToken(activeSession.token)}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors"
                                                title="Copy token"
                                            >
                                                {copied ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <ClipboardDocumentIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={deactivateKiosk}
                                    disabled={deactivating}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    <StopIcon className="h-5 w-5" />
                                    {deactivating ? 'Deactivating...' : 'Deactivate Session'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <XCircleIcon className="h-6 w-6" />
                                    <span className="text-gray-600">No active session</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    The kiosk is currently inactive. Activate a session to allow customers to submit feedback.
                                </p>
                                <button
                                    onClick={activateKiosk}
                                    disabled={activating}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    <PlayIcon className="h-5 w-5" />
                                    {activating ? 'Activating...' : 'Activate Kiosk Session'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <ClockIcon className="h-5 w-5 text-indigo-500" />
                            Session History
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Record of all kiosk sessions for this department</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activated At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activated By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deactivated By</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sessions.map((session, idx) => (
                                    <tr key={session.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                            {new Date(session.activated_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                            {session.expires_at ? new Date(session.expires_at).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                session.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {session.is_active && <CheckCircleIcon className="h-3 w-3" />}
                                                {session.is_active ? 'Active' : 'Ended'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                            {session.activated_by?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                            {session.deactivated_by?.name || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {sessions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No sessions recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DepartmentHeadLayout>
    );
}
