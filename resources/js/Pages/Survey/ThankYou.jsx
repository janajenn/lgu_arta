// resources/js/Pages/Survey/ThankYou.jsx
import { Head, Link } from '@inertiajs/react';

export default function SurveyThankYou() {
    return (
        <>
            <Head title="Thank You" />
            
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 min-h-screen w-full">
                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-32 -top-32 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    
                    {/* Green wave pattern */}
                    <svg className="absolute bottom-0 left-0 w-full h-64 text-green-600" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="currentColor" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
                
                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Success Icon */}
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl">
                                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Main Message */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Thank You!
                        </h1>
                        
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border border-green-100 mb-10">
                            <p className="text-2xl sm:text-3xl text-gray-800 mb-6">
                                Your transaction has been successfully recorded.
                            </p>
                            
                            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                                We appreciate your time. Your participation helps us improve our HR services 
                                and serve you better in the future.
                            </p>
                            
                            {/* Transaction Details */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 mb-8 border border-green-200">
                                <h3 className="font-bold text-green-800 text-lg mb-4">Transaction Recorded</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="text-left">
                                        <p className="text-sm text-green-700 font-medium">Status:</p>
                                        <p className="text-green-900 font-bold">✓ Successfully Logged</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm text-green-700 font-medium">Timestamp:</p>
                                        <p className="text-green-900 font-bold">{new Date().toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Next Steps */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="bg-white p-6 rounded-xl border border-green-200">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                                        <span className="text-green-600 font-bold">1</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Service Analysis</h4>
                                    <p className="text-gray-600 text-sm">
                                        Your transaction data helps us analyze service demand
                                    </p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-xl border border-green-200">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                                        <span className="text-green-600 font-bold">2</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Resource Planning</h4>
                                    <p className="text-gray-600 text-sm">
                                        We'll allocate resources based on transaction volume
                                    </p>
                                </div>
                                
                                <div className="bg-white p-6 rounded-xl border border-green-200">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                                        <span className="text-green-600 font-bold">3</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">Continuous Improvement</h4>
                                    <p className="text-gray-600 text-sm">
                                        Your contribution helps us enhance service quality
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                 href={route('public.departments')}
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                </svg>
                                Record Another Transaction
                            </Link>
                            
                            <a
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Return to Homepage
                            </a>
                        </div>
                        
                        {/* Footer Note */}
                        <div className="mt-12 pt-8 border-t border-green-200">
                            <p className="text-gray-500 text-sm">
                                Need assistance? Contact HR Department at 
                                <span className="font-semibold text-blue-600 ml-1">hr-support@example.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
}