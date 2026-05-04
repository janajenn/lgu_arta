import { Head, Link, router, usePage } from '@inertiajs/react';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import FormulasModal from '@/Components/FormulasModal';
import { ArrowLeftIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ReportTitlePage from '../../../Components/ReportTitlePage';
import ReportTableOfContents from '../../../Components/ReportTableOfContents';
import ReportOverviewSection from '../../../Components/ReportOverviewSection';
import ReportScopeSection from '../../../Components/ReportScopeSection';
import ReportDataInterpretation from '../../../Components/ReportDataInterpretation';
import ReportImprovementPlan from '../../../Components/ReportImprovementPlan';
import ReportAnnex from '../../../Components/ReportAnnex';

export default function Preview({
    serviceSummaryData,
    ageDistributionData,
    clientTypeData,
    genderData,
    regionData,
    ccSqdData,
    summaryData,
    serviceRatingsData,
    firstSetQuestions,
    secondSetQuestions,
    lguLogo,
    initialNotes = {},
}) {
    const { flash } = usePage().props;

    const [notes, setNotes] = useState({
        overviewBefore: '',
        overviewAfter: '',
        scopeBefore: '',
        methodologyBefore: '',
        demographicBefore: '',
        ageDiscussion: '',
        regionDiscussion: '',
        clientTypeDiscussion: '',
        ccSqdBefore: '',
        ccSqdDiscussion: '',
        serviceRatingsBefore: '',
        serviceRatingsDiscussion: '',
        unusedServicesDiscussion: '',
        unusedServicesDiscussionAfter: '',
        improvementPlan: '',
        ...initialNotes,
    });

    const [showFormulas, setShowFormulas] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');



    const updateNote = (section, value) => {
        setNotes(prev => ({ ...prev, [section]: value }));
    };

   const saveAllNotes = () => {
    setSaving(true);
    setSaveMessage('');
    router.post(route('reports.notes.save'), {
        notes: notes,
        report_type: 'preview'
    }, {
        preserveState: true,
        preserveScroll: true,
       onSuccess: () => {
    console.log('Save successful!');
    setSaveMessage('Notes saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
},
        onError: (errors) => {
            console.error(errors);
            setSaveMessage('Error saving notes. Please try again.');
            setTimeout(() => setSaveMessage(''), 4000);
        },
        onFinish: () => setSaving(false),
    });
};

    const getAllServices = () => {
        const internal = serviceSummaryData.servicesByCategory.internal || [];
        const external = serviceSummaryData.servicesByCategory.external || [];
        return [...internal, ...external];
    };
    const unusedServices = getAllServices().filter(s => s.responses === 0);

    return (
        <DepartmentHeadLayout title="Preview Report">
            <Head title="Preview Report" />

            <div className="space-y-8 print:space-y-0">
                {/* Control buttons */}
                <div className="flex items-center justify-between print:hidden">
                    <Link
                        href={route('department-head.reports.index')}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Reports
                    </Link>
                    <div className="flex gap-3">
                        <button
                            onClick={saveAllNotes}
                            disabled={saving}
                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Notes'}
                        </button>
                        <button
                            onClick={() => setShowFormulas(true)}
                            className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                        >
                            <InformationCircleIcon className="h-5 w-5 mr-1" />
                            Formulas
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                        >
                            Print / Save as PDF
                        </button>
                    </div>
                </div>

               {/* ✅ ADD TOAST HERE – outside report-container */}
    {saveMessage && (
        <div className="fixed top-4 right-4 z-[9999] px-4 py-2 rounded-lg shadow-lg bg-green-100 text-green-800">
            {saveMessage}
        </div>
    )}

                {/* Report content */}
                <div className="report-container">
                    <ReportTitlePage lguLogo={lguLogo} />
                    <div className="page-break"></div>
                    <ReportTableOfContents />
                    <div className="page-break"></div>
                    <ReportOverviewSection
                        summaryData={summaryData}
                        notes={notes}
                        updateNote={updateNote}
                    />
                    <div className="page-break"></div>
                    <ReportScopeSection
                        serviceSummaryData={serviceSummaryData}
                        notes={notes}
                        updateNote={updateNote}
                    />
                    <div className="page-break"></div>
                    <ReportDataInterpretation
                        ageDistributionData={ageDistributionData}
                        regionData={regionData}
                        clientTypeData={clientTypeData}
                        ccSqdData={ccSqdData}
                        serviceRatingsData={serviceRatingsData}
                        unusedServices={unusedServices}
                        notes={notes}
                        updateNote={updateNote}
                    />
                    <div className="page-break"></div>
                    <ReportImprovementPlan
                        notes={notes}
                        updateNote={updateNote}
                    />
                    <div className="page-break"></div>
                    <ReportAnnex
                        firstSetQuestions={firstSetQuestions}
                        secondSetQuestions={secondSetQuestions}
                    />
                </div>
            </div>

            <FormulasModal isOpen={showFormulas} onClose={() => setShowFormulas(false)} />

           <style>{`
    @media print {
        body * {
            visibility: hidden;
        }
        .report-container, .report-container * {
            visibility: visible;
        }
        .report-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        .page-break {
            page-break-before: always;
        }
        .print\\:hidden {
            display: none !important;
        }
    }
`}</style>
        </DepartmentHeadLayout>
    );
}
