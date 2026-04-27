import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function SurveyWelcome() {
    const [selectedService, setSelectedService] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        service_availed: '',
    });

    const handleServiceSelect = (serviceValue, serviceLabel) => {
        setSelectedService(serviceValue);
        setData('service_availed', serviceValue);
    };

    const handleSubmit = (withSurvey) => {
        if (!selectedService) {
            alert('Please select a service first.');
            return;
        }

        setIsSubmitting(true);

        const selectedServiceObj = hrServices.find(s => s.value === selectedService);

        if (withSurvey) {
            router.get(route('survey.create'), {
                serviceId: selectedServiceObj.id
            });
        } else {
            setData('service_availed', selectedService);
            post(route('survey.record-transaction'), {
                onSuccess: () => {
                    setIsSubmitting(false);
                    router.visit(route('survey.thank-you'));
                },
                onError: (errors) => {
                    console.error('Failed to record transaction:', errors);
                    setIsSubmitting(false);
                    alert('Failed to record service transaction. Please try again.');
                },
                onFinish: () => {
                    setIsSubmitting(false);
                }
            });
        }
    };

    const hrServices = [
        {
            id: 'leave_application',
            value: 'Internal Service 3 – Administration of Leave Application',
            title: 'Leave Application',
            bisayaTitle: 'Pagdumala og Leave Application',
            icon: '📋',
            description: 'Processing of vacation, sick, emergency, and other types of leave'
        },
        {
            id: 'certificate_request',
            value: 'Internal Service 1 – Issuance of Certificates',
            title: 'Certificate Request',
            bisayaTitle: 'Paghatag og Sertipiko',
            icon: '📄',
            description: 'Issuance of employment, clearance, and other official certificates'
        },
        {
            id: 'travel_order',
            value: 'Internal Service 2 – Issuance of Travel Order',
            title: 'Travel Order',
            bisayaTitle: 'Paghatag og Travel Order',
            icon: '✈️',
            description: 'Processing and issuance of official travel orders'
        }
    ];

    return (
        <>
            <Head title="HR Service Feedback Portal" />

            <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 min-h-screen w-full">
                {/* Background blobs – fully responsive */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-32 -top-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                    <svg className="absolute bottom-0 left-0 w-full h-64 text-blue-600" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="currentColor" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
                    {/* Navigation - responsive */}
                    <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 lg:mb-16 max-w-7xl mx-auto">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                                <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                                    HR Department
                                </h1>
                                <p className="text-xs text-gray-600 font-medium">Service Feedback Portal</p>
                            </div>
                        </div>

                        <a
                            href="/login"
                            className="group relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 shadow-lg shadow-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-blue-800"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Login
                            </span>
                        </a>
                    </nav>

                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-2 sm:px-4">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 tracking-tight">
                                Welcome to the <span className="text-blue-600">HR Service Feedback</span> Portal
                            </h1>
                            <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-white p-4 sm:p-6 rounded-2xl shadow-lg border border-blue-100">
                                <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-3 sm:mb-4">
                                    <span className="font-semibold">Did you avail any of our HR services today?</span>
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Your feedback helps us improve services for all employees. The survey is optional,
                                    but we'd appreciate your honest input.
                                </p>
                            </div>
                        </div>

                        {/* Service Selection Card */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-10 sm:mb-12 border border-blue-100">
                            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
                                <div className="text-center">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                                        Step 1: Select Your HR Service
                                    </h2>
                                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                                        Please choose the HR service you availed today (Required)
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 md:p-8">
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4 text-center">
                                        Available HR Services
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
                                        Select the service you transacted with today
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    {hrServices.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => handleServiceSelect(service.value, service.title)}
                                            className={`p-4 sm:p-5 md:p-6 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                                                selectedService === service.value
                                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 ${
                                                    selectedService === service.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {service.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 ${
                                                        selectedService === service.value ? 'text-blue-700' : 'text-gray-800'
                                                    }`}>
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                                                        {service.description}
                                                    </p>
                                                    <div className="text-xs text-gray-500 bg-gray-50 p-1.5 sm:p-2 rounded-lg">
                                                        <span className="font-medium">Internal Service:</span> {service.value.split('–')[0]}
                                                    </div>
                                                </div>
                                                {selectedService === service.value && (
                                                    <div className="mt-3 sm:mt-4 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {selectedService && (
                                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium text-blue-700 text-sm sm:text-base">Selected Service:</span>
                                            </div>
                                            <span className="font-bold text-blue-800 text-sm sm:text-base">
                                                {hrServices.find(s => s.value === selectedService)?.title || selectedService}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!selectedService && (
                                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-yellow-700 font-medium text-sm sm:text-base">Please select a service to continue</span>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-6 sm:pt-8 mt-6 sm:mt-8">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
                                        Step 2: Choose About the Survey
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
                                        The survey helps us improve our HR services. Your participation is optional but greatly appreciated.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {/* Give Feedback Button */}
                                        <button
                                            onClick={() => handleSubmit(true)}
                                            disabled={!selectedService || isSubmitting}
                                            className={`p-5 sm:p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                                                !selectedService || isSubmitting
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:shadow-xl border-green-200 hover:border-green-300'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-green-100 flex items-center justify-center mb-3 sm:mb-4">
                                                    <svg className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Give Feedback</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
                                                    Help us improve by answering a short survey
                                                </p>
                                                <div className="flex items-center text-green-600 font-medium text-sm sm:text-base">
                                                    <span>Proceed to Survey</span>
                                                    <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Skip Survey Button */}
                                        <button
                                            onClick={() => handleSubmit(false)}
                                            disabled={!selectedService || isSubmitting}
                                            className={`p-5 sm:p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                                                !selectedService || isSubmitting
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:shadow-xl border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
                                                    <svg className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Skip Survey</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
                                                    Just record my transaction without feedback
                                                </p>
                                                <div className="flex items-center text-gray-500 font-medium text-sm sm:text-base">
                                                    <span>No survey needed</span>
                                                    <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {isSubmitting && (
                                        <div className="mt-6 text-center">
                                            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm sm:text-base">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing your request...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
                            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg border border-blue-100">
                                <div className="flex items-center mb-3 sm:mb-4">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Track Service Demand</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Recording transactions helps us understand service demand patterns and allocate resources efficiently.
                                </p>
                            </div>

                            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg border border-blue-100">
                                <div className="flex items-center mb-3 sm:mb-4">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Confidential & Secure</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    All transaction data is confidential and protected under data privacy regulations.
                                </p>
                            </div>

                            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg border border-blue-100">
                                <div className="flex items-center mb-3 sm:mb-4">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4">
                                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Improve HR Services</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Your feedback helps us streamline HR processes and enhance employee experience.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center border-t border-blue-200 pt-8 sm:pt-10">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-600 flex items-center justify-center mr-2 sm:mr-3">
                                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">Human Resources Department</h4>
                                        <p className="text-gray-600 text-xs sm:text-sm">Service Feedback System</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-xs sm:text-sm">
                                    For assistance, contact HR Support:
                                    <span className="font-semibold text-blue-600 ml-1">hrmo@gmail.com</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
