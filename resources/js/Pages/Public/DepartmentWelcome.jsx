import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BuildingOfficeIcon, DocumentTextIcon, GlobeAltIcon, ClipboardDocumentCheckIcon, CalendarIcon, UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

// Define color themes (each with primary, secondary, gradient, blob colors)
const themes = [
    {
        name: 'blue',
        primary: '#3B82F6', // blue-500
        secondary: '#1E3A8A', // blue-900
        gradientFrom: '#2563EB', // blue-600
        gradientTo: '#1E40AF', // blue-800
        blob1: '#3B82F6', // blue-500
        blob2: '#60A5FA', // blue-400
        blob3: '#2563EB', // blue-600
        buttonFrom: '#1E40AF', // blue-800
        buttonTo: '#1E3A8A', // blue-900
        ring: '#DBEAFE', // blue-100
        border: '#BFDBFE', // blue-200
        lightBg: '#EFF6FF', // blue-50
    },
    {
        name: 'green',
        primary: '#10B981', // green-500
        secondary: '#064E3B', // green-900
        gradientFrom: '#059669', // green-600
        gradientTo: '#047857', // green-700
        blob1: '#10B981',
        blob2: '#34D399',
        blob3: '#059669',
        buttonFrom: '#047857',
        buttonTo: '#065F46',
        ring: '#D1FAE5',
        border: '#A7F3D0',
        lightBg: '#ECFDF5',
    },
    {
        name: 'purple',
        primary: '#8B5CF6', // purple-500
        secondary: '#4C1D95', // purple-900
        gradientFrom: '#7C3AED', // purple-600
        gradientTo: '#5B21B6', // purple-800
        blob1: '#8B5CF6',
        blob2: '#A78BFA',
        blob3: '#7C3AED',
        buttonFrom: '#5B21B6',
        buttonTo: '#4C1D95',
        ring: '#EDE9FE',
        border: '#DDD6FE',
        lightBg: '#F5F3FF',
    },
    {
        name: 'orange',
        primary: '#F97316', // orange-500
        secondary: '#7C2D12', // orange-900
        gradientFrom: '#EA580C', // orange-600
        gradientTo: '#C2410C', // orange-700
        blob1: '#F97316',
        blob2: '#FB923C',
        blob3: '#EA580C',
        buttonFrom: '#C2410C',
        buttonTo: '#9A3412',
        ring: '#FFEDD5',
        border: '#FED7AA',
        lightBg: '#FFF7ED',
    },
    {
        name: 'red',
        primary: '#EF4444', // red-500
        secondary: '#7F1D1D', // red-900
        gradientFrom: '#DC2626', // red-600
        gradientTo: '#B91C1C', // red-700
        blob1: '#EF4444',
        blob2: '#F87171',
        blob3: '#DC2626',
        buttonFrom: '#B91C1C',
        buttonTo: '#991B1B',
        ring: '#FEE2E2',
        border: '#FECACA',
        lightBg: '#FEF2F2',
    },
    {
        name: 'teal',
        primary: '#14B8A6', // teal-500
        secondary: '#115E59', // teal-900
        gradientFrom: '#0D9488', // teal-600
        gradientTo: '#0F766E', // teal-700
        blob1: '#14B8A6',
        blob2: '#2DD4BF',
        blob3: '#0D9488',
        buttonFrom: '#0F766E',
        buttonTo: '#115E59',
        ring: '#CCFBF1',
        border: '#99F6E4',
        lightBg: '#F0FDFA',
    },
];

export default function DepartmentWelcome({ department }) {
    const [selectedService, setSelectedService] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post } = useForm({
        service_id: '',
    });

    // Pick a theme based on department id (modulo number of themes)
    const themeIndex = (department.id - 1) % themes.length;
    const theme = themes[themeIndex];

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
            <div className="relative overflow-hidden min-h-screen w-full" style={{ background: `linear-gradient(to bottom right, white, ${theme.lightBg})` }}>
                {/* Animated blobs with theme colors */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ backgroundColor: theme.blob1 }}></div>
                    <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: theme.blob2 }}></div>
                    <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: theme.blob3 }}></div>
                    <svg className="absolute bottom-0 left-0 w-full h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill={theme.primary} fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="relative z-10 w-full px-4 py-8 sm:py-12 lg:py-16">
                    {/* Navigation */}
                    <nav className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg ring-4" style={{ background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`, ringColor: theme.ring }}>
                                <BuildingOfficeIcon className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold" style={{ background: `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {department.name}
                                </h1>
                                <p className="text-xs text-gray-600 font-medium">Service Feedback Portal</p>
                            </div>
                        </div>
                        <a
                            href="/login"
                            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2"
                            style={{ background: `linear-gradient(to right, ${theme.buttonFrom}, ${theme.buttonTo})`, borderColor: theme.buttonTo }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Login
                            </span>
                        </a>
                    </nav>

                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-12 sm:mb-16 px-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                                Welcome to the <span style={{ color: theme.primary }}>{department.name} Feedback</span> Portal
                            </h1>
                            <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg border" style={{ background: `linear-gradient(to right, ${theme.lightBg}, white)`, borderColor: theme.border }}>
                                <p className="text-xl text-gray-700 mb-4">
                                    <span className="font-semibold">Did you avail any of our services today?</span>
                                </p>
                                <p className="text-gray-600">
                                    Your feedback helps us improve services. The survey is optional, but we'd appreciate your honest input.
                                </p>
                            </div>
                        </div>

                        {/* Service Selection Card */}
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border" style={{ borderColor: theme.border }}>
                            <div className="px-8 py-10" style={{ background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})` }}>
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
                                                    selectedService?.id === service.id ? 'bg-opacity-20' : ''
                                                }`}
                                                style={{
                                                    borderColor: selectedService?.id === service.id ? theme.primary : theme.border,
                                                    backgroundColor: selectedService?.id === service.id ? theme.lightBg : 'white',
                                                }}
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                                                        selectedService?.id === service.id ? 'bg-opacity-100' : 'bg-gray-100'
                                                    }`} style={{ backgroundColor: selectedService?.id === service.id ? theme.lightBg : undefined }}>
                                                        <IconComponent className="h-8 w-8" style={{ color: selectedService?.id === service.id ? theme.primary : '#6B7280' }} />
                                                    </div>
                                                    <h3 className={`text-lg font-bold mb-2 ${selectedService?.id === service.id ? '' : 'text-gray-800'}`} style={{ color: selectedService?.id === service.id ? theme.primary : undefined }}>
                                                        {service.name}
                                                    </h3>
                                                    {service.description && (
                                                        <p className="text-sm text-gray-600">{service.description}</p>
                                                    )}
                                                    {selectedService?.id === service.id && (
                                                        <div className="mt-4 h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
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
                                    <div className="mb-6 p-4 border rounded-xl" style={{ backgroundColor: theme.lightBg, borderColor: theme.border }}>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium" style={{ color: theme.secondary }}>Selected Service:</span>
                                            <span className="font-bold" style={{ color: theme.primary }}>{selectedService.name}</span>
                                        </div>
                                    </div>
                                )}

                                {!selectedService && (
                                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <p className="text-yellow-700 font-medium">Please select a service to continue</p>
                                    </div>
                                )}

                                <div className="border-t pt-8 mt-8" style={{ borderColor: theme.border }}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Step 2: Choose About the Survey</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <button
                                            onClick={() => handleSubmit(true)}
                                            disabled={!selectedService || isSubmitting}
                                            className={`p-8 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                                                !selectedService || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                                            }`}
                                            style={{
                                                borderColor: theme.border,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: theme.lightBg }}>
                                                    <svg className="h-8 w-8" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Give Feedback</h4>
                                                <p className="text-gray-600 text-center mb-4">Help us improve by answering a short survey</p>
                                                <span className="font-medium" style={{ color: theme.primary }}>Proceed to Survey →</span>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleSubmit(false)}
                                            disabled={!selectedService || isSubmitting}
                                            className={`p-8 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                                                !selectedService || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                                            }`}
                                            style={{
                                                borderColor: theme.border,
                                                backgroundColor: 'white',
                                            }}
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
                                            <div className="inline-flex items-center px-4 py-2 rounded-xl" style={{ backgroundColor: theme.lightBg, color: theme.primary }}>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
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
