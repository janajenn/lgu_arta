import AuthenticatedLayout from '@/Shared/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiLogIn } from 'react-icons/fi';

export default function Unauthorized() {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Start countdown
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect to login after countdown
                    router.visit(route('login'));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Unauthorized Access
                </h2>
            }
        >
            <Head title="Unauthorized Access" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12">
                <div className="mx-auto max-w-md w-full px-4 sm:px-6 lg:px-8">
                    {/* Unauthorized Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                        {/* Red Alert Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
                                <FiAlertTriangle className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                            <p className="text-red-100">You do not have permission to view this page</p>
                        </div>

                        <div className="p-8">
                            {/* Main Message */}
                            <div className="text-center mb-8">
                                <div className="mb-6">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-100 to-red-50 rounded-full flex items-center justify-center mb-4">
                                        <FiAlertTriangle className="h-12 w-12 text-red-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
                                    <p className="text-gray-600 mb-4">
                                        You don't have the necessary permissions to access the dashboard.
                                        Please contact your administrator if you believe this is an error.
                                    </p>
                                </div>

                                {/* Countdown Timer */}
                                <div className="mb-8">
                                    <div className="inline-block bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
                                        <p className="text-sm font-medium text-red-800 mb-2">
                                            Redirecting to login page in:
                                        </p>
                                        <div className="text-4xl font-bold text-red-600 mb-2">
                                            {countdown}
                                        </div>
                                        <p className="text-xs text-red-600">seconds</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div 
                                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(5 - countdown) * 20}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>0s</span>
                                        <span>2.5s</span>
                                        <span>5s</span>
                                    </div>
                                </div>

                                {/* Manual Redirect Button */}
                                <div className="space-y-4">
                                    <button
                                        onClick={() => router.visit(route('login'))}
                                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                    >
                                        <FiLogIn className="mr-2 h-5 w-5" />
                                        Go to Login Now
                                    </button>

                                    <button
                                        onClick={() => router.visit('/')}
                                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-xl shadow-sm hover:from-gray-300 hover:to-gray-400 hover:shadow-md transition-all duration-300"
                                    >
                                        Return to Homepage
                                    </button>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                            1
                                        </span>
                                        Ensure you're using the correct account
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                            2
                                        </span>
                                        Contact your system administrator
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                            3
                                        </span>
                                        Check if you have the required permissions
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} HR Service Analytics. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}