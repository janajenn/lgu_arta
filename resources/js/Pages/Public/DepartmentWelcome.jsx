import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BuildingOfficeIcon, DocumentTextIcon, GlobeAltIcon, ClipboardDocumentCheckIcon, CalendarIcon, UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export default function DepartmentWelcome({ department }) {
    const [selectedService, setSelectedService] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post } = useForm({
        service_id: '',
    });

    const serviceIcons = [
        DocumentTextIcon,
        GlobeAltIcon,
        ClipboardDocumentCheckIcon,
        CalendarIcon,
        UserGroupIcon,
        BriefcaseIcon,
    ];

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setData('service_id', service.id);
    };

    const handleSubmit = (withSurvey) => {
        if (!selectedService) {
            alert('Please select a service first.');
            return;
        }

        setIsSubmitting(true);

        if (withSurvey) {
            router.get(route('survey.create'), { service_id: selectedService.id });
        } else {
            post(route('survey.record-transaction'), {
                onSuccess: () => router.visit(route('survey.thank-you')),
                onError: () => {
                    alert('Failed to record transaction. Please try again.');
                    setIsSubmitting(false);
                }
            });
        }
    };

    return (
        <>
            <Head title={`${department.name} Service Feedback`} />
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 min-h-screen w-full">
                {/* Animated blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-32 -top-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                    <svg className="absolute bottom-0 left-0 w-full h-64 text-blue-600" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="currentColor" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
                
                <div className="relative z-10 w-full px-4 py-8 sm:py-12 lg:py-16">
                    {/* Navigation */}
                    <nav className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                                <BuildingOfficeIcon className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                                    {department.name}
                                </h1>
                                <p className="text-xs text-gray-600 font-medium">Service Feedback Portal</p>
                            </div>
                        </div>
                        <a
                            href="/login"
                            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 shadow-lg shadow-blue-300 hover:shadow-xl hover:shadow-blue-400 transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-blue-800"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Login as Department Head
                            </span>
                        </a>
                    </nav>

                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-12 sm:mb-16 px-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                                Welcome to the <span className="text-blue-600">{department.name} Feedback</span> Portal
                            </h1>
                            <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100">
                                <p className="text-xl text-gray-700 mb-4">
                                    <span className="font-semibold">Did you avail any of our services today?</span>
                                </p>
                                <p className="text-gray-600">
                                    Your feedback helps us improve services. The survey is optional, but we'd appreciate your honest input.
                                </p>
                            </div>
                        </div>

                        {/* Service Selection Card */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border border-blue-100">
                            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-8 py-10">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-center">
                                    Step 1: Select a Service
                                </h2>
                                <p className="text-blue-100 text-lg text-center">
                                    Please choose the service you availed today (Required)
                                </p>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    {department.services.map((service, index) => {
                                        const IconComponent = serviceIcons[index % serviceIcons.length];
                                        return (
                                            <button
                                                key={service.id}
                                                onClick={() => handleServiceSelect(service)}
                                                className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                                                    selectedService?.id === service.id
                                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                                                        selectedService?.id === service.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        <IconComponent className="h-8 w-8" />
                                                    </div>
                                                    <h3 className={`text-lg font-bold mb-2 ${
                                                        selectedService?.id === service.id ? 'text-blue-700' : 'text-gray-800'
                                                    }`}>
                                                        {service.name}
                                                    </h3>
                                                    {service.description && (
                                                        <p className="text-sm text-gray-600">{service.description}</p>
                                                    )}
                                                    {selectedService?.id === service.id && (
                                                        <div className="mt-4 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedService && (
                                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-blue-700">Selected Service:</span>
                                            <span className="font-bold text-blue-800">{selectedService.name}</span>
                                        </div>
                                    </div>
                                )}

                                {!selectedService && (
                                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <p className="text-yellow-700 font-medium">Please select a service to continue</p>
                                    </div>
                                )}

                                <div className="border-t pt-8 mt-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Step 2: Choose About the Survey</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => handleSubmit(true)}
                                            disabled={!selectedService || isSubmitting}
                                            className={`p-8 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                                                !selectedService || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl border-green-200 hover:border-green-300'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Give Feedback</h4>
                                                <p className="text-gray-600 text-center mb-4">Help us improve by answering a short survey</p>
                                                <span className="text-green-600 font-medium">Proceed to Survey →</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleSubmit(false)}
                                            disabled={!selectedService || isSubmitting}
                                            className={`p-8 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                                                !selectedService || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                    <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Skip Survey</h4>
                                                <p className="text-gray-600 text-center mb-4">Just record my transaction without feedback</p>
                                                <span className="text-gray-500 font-medium">No survey needed ✓</span>
                                            </div>
                                        </button>
                                    </div>
                                    {isSubmitting && (
                                        <div className="mt-6 text-center">
                                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                </svg>
                                                Processing...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </>
    );
}