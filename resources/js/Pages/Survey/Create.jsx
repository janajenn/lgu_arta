// resources/js/Pages/Survey/Create.jsx
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function SurveyCreate({ firstSetQuestions, secondSetQuestions, service, department, services }) {
    // Pre-fill service availed if a service is provided
    const initialService = service?.name || '';

    const { data, setData, post, processing, errors } = useForm({
        respondent: {
            client_type: 'citizen',
            date_of_transaction: '',
            sex: 'prefer_not_to_say',
            age: '',
            region_of_residence: 'Region X (Northern Mindanao)',
            service_availed: initialService,
        },
        service_id: service?.id || '',
        responses: {},
        suggestions: '',
        email: ''



    });

    const requiredQuestionIds = [
    ...firstSetQuestions.map(q => q.custom_id),
    ...secondSetQuestions.map(q => q.custom_id)
];


const allQuestionsAnswered = requiredQuestionIds.every(id =>
    data.responses[id] !== undefined && data.responses[id] !== ''
);

    const [isBisaya, setIsBisaya] = useState(false);

    const handleRespondentChange = (field, value) => {
        setData('respondent', {
            ...data.respondent,
            [field]: value
        });
    };

    const handleResponseChange = (customId, value) => {
        setData('responses', {
            ...data.responses,
            [customId]: value
        });
    };

    // Automatically set CC2 and CC3 when CC1 is option 4
    useEffect(() => {
        if (data.responses['CC1'] === '4') {
            if (data.responses['CC2'] !== '5') {
                handleResponseChange('CC2', '5');
            }
            if (data.responses['CC3'] !== '4') {
                handleResponseChange('CC3', '4');
            }
        }
    }, [data.responses['CC1']]);

    const handleSuggestionsChange = (e) => {
        setData('suggestions', e.target.value);
    };

    const handleEmailChange = (e) => {
        setData('email', e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('survey.store'));
    };

    // Philippine Regions
    const regions = [
        'National Capital Region (NCR)',
        'Cordillera Administrative Region (CAR)',
        'Region I (Ilocos Region)',
        'Region II (Cagayan Valley)',
        'Region III (Central Luzon)',
        'Region IV-A (CALABARZON)',
        'Region IV-B (MIMAROPA)',
        'Region V (Bicol Region)',
        'Region VI (Western Visayas)',
        'Region VII (Central Visayas)',
        'Region VIII (Eastern Visayas)',
        'Region IX (Zamboanga Peninsula)',
        'Region X (Northern Mindanao)',
        'Region XI (Davao Region)',
        'Region XII (SOCCSKSARGEN)',
        'Region XIII (Caraga)',
        'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'
    ];

    // Response Options for SQD questions
    const responseOptions = isBisaya ? [
        { value: 'Dili gyud Kaayo Mouyon', label: 'Dili gyud Kaayo Mouyon', short: 'DKM' },
        { value: 'Dili Mouyon', label: 'Dili Mouyon', short: 'DM' },
        { value: 'Wala Mouyon o Dili Mouyon', label: 'Wala Mouyon o Dili Mouyon', short: 'WM/DM' },
        { value: 'Mouyon', label: 'Mouyon', short: 'M' },
        { value: 'Mouyon gyud Kaayo', label: 'Mouyon gyud Kaayo', short: 'MK' },
        { value: 'N/A (Dili Aplikable)', label: 'N/A (Dili Aplikable)', short: 'N/A' }
    ] : [
        { value: 'Strongly Disagree', label: 'Strongly Disagree', short: 'SD' },
        { value: 'Disagree', label: 'Disagree', short: 'D' },
        { value: 'Neither Agree Nor Disagree', label: 'Neither Agree Nor Disagree', short: 'N' },
        { value: 'Agree', label: 'Agree', short: 'A' },
        { value: 'Strongly Agree', label: 'Strongly Agree', short: 'SA' },
        { value: 'N/A (Not Applicable)', label: 'N/A (Not Applicable)', short: 'N/A' }
    ];





    // Bisaya Translations
    const translations = {
        // Header and instructions
        'title': 'ARTA Service Feedback Survey',
        'subtitle': 'Tabangi kami sa pagpalambo sa among mga serbisyo pinaagi sa pagkompleto niini nga survey. Hinungdanon kanamo ang imong feedback.',
        'respondent_info': 'Impormasyon sa Respondent',
        'cc_awareness': 'Kahibalo sa Citizen\'s Charter (CC)',
        'cc_description': 'Ang Citizen\'s Charter usa ka dokumento nga naghulagway sa mga serbisyo nga gipanghatag sa usa ka opisina sa gobyerno, lakip ang step-by-step nga pamaagi sa pag-avail niini nga mga serbisyo, ang mga empleyado nga responsable sa matag lakang, ug ang pinakataas nga oras sa pagtapos sa proseso.',
        'service_assessment': 'Pagtasa sa Serbisyo',
        'sqd_instructions': 'Alang sa SQD 0–8, palihug butangi ug check mark (✔) ang kolum nga pinakatakos sa imong tubag.',
        'service_assessment_sub': 'Palihug i-rate ang imong kasabutan sa mosunod nga mga pahayag:',
        'suggestions_title': 'Mga sugyot kung unsaon pa namo pagpaayo ang among serbisyo (opsyonal):',
        'email_title': 'Email address (opsyonal):',
        'thank_you': 'SALAMAT KAAYO!',
        'confidential': 'Ang tanan nga impormasyon nga gipanghatag pagatagoan ug gigamit lamang alang sa katuyoan sa pagpalambo sa serbisyo.',
        'submit_survey': 'Isumite ang Survey',
        'submitting': 'Ginasumite...',

        // Respondent Information Labels
        'client_type': 'Klase sa Kliyente *',
        'date_of_transaction': 'Petsa sa Transaksyon *',
        'sex': 'Sekso *',
        'age': 'Edad *',
        'region_of_residence': 'Rehiyon sa Panimalay *',
        'service_availed': 'Serbisyo nga Giavil *',

        // Citizen's Charter Questions
        'cc1_title': 'CC1. Asa sa mosunod ang pinakahustong naghulagway sa imong kahibalo bahin sa CC?',
        'cc1_option1': '1. Kabalo ko unsa ang CC ug nakita nako ang CC niining opisina.',
        'cc1_option2': '2. Kabalo ko unsa ang CC apan wala nako nakita ang CC niining opisina.',
        'cc1_option3': '3. Nakahibalo ra ko bahin sa CC sa dihang nakita nako ang CC niining opisina.',
        'cc1_option4': '4. Wala ko kahibalo unsa ang CC ug wala sab ko makakita og CC niining opisina.',
        'cc1_note': '(Tubaga og "N/A" ang CC2 ug CC3)',

        'cc2_title': 'CC2. Kung kabalo ka sa CC (mitubag og 1–3 sa CC1), unsa man imong ikasulti bahin sa CC niining opisina?',
        'cc2_option1': '1. Sayon ra kaayo makita',
        'cc2_option2': '2. Medyo sayon makita',
        'cc2_option3': '3. Lisod makita',
        'cc2_option4': '4. Dili gyud makita',
        'cc2_option5': '5. N/A',

        'cc3_title': 'CC3. Kung kabalo ka sa CC (mitubag og 1–3 sa CC1), pila ka dako ang tabang sa CC sa imong transaksyon?',
        'cc3_option1': '1. Dakô kaayo og tabang',
        'cc3_option2': '2. Medyo nakatabang',
        'cc3_option3': '3. Wala gyud nakatabang',
        'cc3_option4': '4. N/A',

        // Table headers
        'statement': 'Pahayag',
        'strongly_disagree': 'Dili gyud kaayo Mouyon',
        'disagree': 'Dili Mouyon',
        'neutral': 'Wala Mouyon o Dili Mouyon',
        'agree': 'Mouyon',
        'strongly_agree': ' Mouyon gyud Kaayo',
        'not_applicable': 'N/A (Dili Aplikable)',

        // Radio button labels
        'yes': 'Oo',
        'no': 'Dili',
        'male': 'Lalaki',
        'female': 'Babaye',
        'prefer_not_to_say': 'Mas gusto nga dili moingon',
        'citizen': 'Sitilyano',
        'business': 'Negosyo',
        'government': 'Gobyerno'
    };

    // English content
    const english = {
        // Header and instructions
        'title': 'ARTA Service Feedback Survey',
        'subtitle': 'Please help us improve our services by completing this survey. Your feedback is valuable to us.',
        'respondent_info': 'Respondent Information',
        'cc_awareness': 'Citizen\'s Charter (CC) Awareness',
        'cc_description': 'The Citizen\'s Charter is a document that outlines the services provided by a government office, the step-by-step procedure to avail these services, the employees responsible for each step, and the maximum time to conclude the process.',
        'service_assessment': 'Service Assessment',
        'sqd_instructions': 'For SQD 0–8, please put a check mark (✔) on the column that best corresponds to your answer.',
        'service_assessment_sub': 'Please rate your agreement with the following statements:',
        'suggestions_title': 'Suggestions on how we can further improve our services (optional):',
        'email_title': 'Email address (optional):',
        'thank_you': 'THANK YOU!',
        'confidential': 'All information provided will be kept confidential and used only for service improvement purposes.',
        'submit_survey': 'Submit Survey',
        'submitting': 'Submitting...',

        // Respondent Information Labels
        'client_type': 'Client Type *',
        'date_of_transaction': 'Date of Transaction *',
        'sex': 'Sex *',
        'age': 'Age *',
        'region_of_residence': 'Region of Residence *',
        'service_availed': 'Service Availed *',

        // Citizen's Charter Questions
        'cc1_title': 'CC1. Which of the following best describes your awareness of a Citizens Charter (CC)?',
        'cc1_option1': '1. I know what a CC is and I saw this office\'s CC.',
        'cc1_option2': '2. I know what a CC is but I did NOT see this office\'s CC.',
        'cc1_option3': '3. I learned of the CC only when I saw this office\'s CC.',
        'cc1_option4': '4. I do not know what a CC is and I did not see one in this office.',
        'cc1_note': '(Answer "N/A" on CC2 and CC3)',

        'cc2_title': 'CC2. If aware of CC (answered 1–3 in CC1), would you say that the Citizens Charter of this office was … ?',
        'cc2_option1': '1. Easy to see',
        'cc2_option2': '2. Somewhat easy to see',
        'cc2_option3': '3. Difficult to see',
        'cc2_option4': '4. Not visible at all',
        'cc2_option5': '5. N/A',

        'cc3_title': 'CC3. If aware of Citizens Charter (answered codes 1–3 in CC1), how much did the Citizens Charter help you in your transaction?',
        'cc3_option1': '1. Helped very much',
        'cc3_option2': '2. Somewhat helped',
        'cc3_option3': '3. Did not help',
        'cc3_option4': '4. N/A',

        // Table headers
        'statement': 'Statement',
        'strongly_disagree': 'Strongly Disagree',
        'disagree': 'Disagree',
        'neutral': 'Neither Agree Nor Disagree',
        'agree': 'Agree',
        'strongly_agree': 'Strongly Agree',
        'not_applicable': 'N/A (Not Applicable)',

        // Radio button labels
        'yes': 'Yes',
        'no': 'No',
        'male': 'Male',
        'female': 'Female',
        'prefer_not_to_say': 'Prefer not to say',
        'citizen': 'Citizen',
        'business': 'Business',
        'government': 'Government'
    };


    const sqdBisayaTexts = {
    SQD0: "SQD0. Nalipay ko sa serbisyo nga akong nadawat.",
    SQD1: "SQD1. Makataronganon ang oras nga akong gigugol sa akong transaksyon.",
    SQD2: "SQD2. Gisunod sa opisina ang mga kinahanglanon sa transaksyon ug ako gihatagan og kompleto nga impormasyon.",
    SQD3: "SQD3. Ang mga lakang (lakip ang pagbayad) nga akong gikinahanglan buhaton dali rang sundon.",
    SQD4: "SQD4. Dali ra nako nakit-an ang impormasyon bahin sa akong transaksyon gikan sa opisina o sa ilang website.",
    SQD5: "SQD5. Makataronganon ang mga bayranan nga akong gibayad para sa akong transaksyon.",
    SQD6: "SQD6. Gibati nako nga patas ang opisina sa tanan, o 'walay palakasan'.",
    SQD7: "SQD7. Maayo og pagtratar ang mga staff, ug ako gihatagan og oportunidad sa pagkompleto sa akong transaksyon.",
    SQD8: "SQD8. Nakuha nako ang akong gikinahanglan gikan sa opisina sa gobyerno.",
};

    const t = isBisaya ? translations : english;

    // ✅ 3. Define translateServiceName AFTER t (optional, but must be after translations)
    const translateServiceName = (serviceName) => {
        return translations[serviceName] || serviceName;
    };







    console.log('SurveyCreate – service prop:', service);
console.log('SurveyCreate – department prop:', department);
console.log('Initial service_availed:', initialService);



    return (
        <>
            <Head title="ARTA Survey Questionnaire" />



            <div className="relative overflow-hidden bg-gradient-to-br from-white to-red-50 min-h-screen w-full">


                 {/* Display department/service context if available */}
            {department && service && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg max-w-6xl mx-auto">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">Department:</span> {department.name} —
                        <span className="font-semibold ml-2">Service:</span> {service.name}
                    </p>
                </div>
            )}
            {/* Hidden field for service_id */}
            <input type="hidden" name="service_id" value={data.service_id} />
                {/* Full-width background with animated blobs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-32 -top-32 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    {/* Red wave pattern */}
                    <svg className="absolute bottom-0 left-0 w-full h-64 text-red-600" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path fill="currentColor" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
                    {/* Navigation */}
                    <nav className="flex items-center justify-between mb-6 sm:mb-10 max-w-7xl mx-auto">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg ring-4 ring-red-100">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
                                    ARTA
                                </h1>
                                <p className="text-xs text-gray-600 font-medium">Anti-Red Tape Authority</p>
                            </div>
                        </div>

                        {/* Survey Progress */}
                        <div className="hidden sm:flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">Official Survey</p>
                                <p className="text-xs text-gray-600">Confidential & Secure</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </nav>

                    {/* Main Survey Container */}
                    <div className="max-w-6xl mx-auto">
                        {/* Survey Header Card */}
                        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                                <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                        {t.title}
                                    </h1>
                                    <p className="text-red-100 text-base sm:text-lg">
                                        {t.subtitle}
                                    </p>
                                </div>

                                {/* Language Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setIsBisaya(!isBisaya)}
                                    className={`mt-4 sm:mt-0 flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${isBisaya
                                        ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                                        : 'bg-white text-red-600 hover:bg-red-50'
                                        }`}
                                >
                                    <svg
                                        className={`w-5 h-5 mr-2 transition-transform duration-300 ${isBisaya ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    {isBisaya ? 'Switch to English' : 'Bisaya Version'}
                                </button>
                            </div>

                            {/* <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: '⏱️', text: '10-15 mins' },
                                    { icon: '🔒', text: '100% Confidential' },
                                    { icon: '📋', text: 'Official Survey' },
                                    { icon: '🚫', text: 'No to Palakasan' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                                        <span className="mr-2">{item.icon}</span>
                                        <span className="font-medium text-sm">{item.text}</span>
                                    </div>
                                ))}
                            </div> */}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Respondent Information Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-red-100">
                                <div className="flex items-center mb-6">
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {t.respondent_info}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Client Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.client_type}
                                        </label>
                                        <select
                                            value={data.respondent.client_type}
                                            onChange={(e) => handleRespondentChange('client_type', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                                            required
                                        >
                                            <option value="citizen">{t.citizen}</option>
                                            <option value="business">{t.business}</option>
                                            <option value="government">{t.government}</option>
                                        </select>
                                    </div>

                                    {/* Date of Transaction */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.date_of_transaction}
                                        </label>
                                        <input
                                            type="date"
                                            value={data.respondent.date_of_transaction}
                                            onChange={(e) => handleRespondentChange('date_of_transaction', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* Sex */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.sex}
                                        </label>
                                        <select
                                            value={data.respondent.sex}
                                            onChange={(e) => handleRespondentChange('sex', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                                            required
                                        >
                                            <option value="male">{t.male}</option>
                                            <option value="female">{t.female}</option>
                                            <option value="prefer_not_to_say">{t.prefer_not_to_say}</option>
                                        </select>
                                    </div>

                                    {/* Age */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.age}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={data.respondent.age}
                                            onChange={(e) => handleRespondentChange('age', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                                            required
                                        />
                                    </div>

                                    {/* Region of Residence */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.region_of_residence}
                                        </label>
                                        <select
                                            value={data.respondent.region_of_residence}
                                            onChange={(e) => handleRespondentChange('region_of_residence', e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                                            required
                                        >
                                            <option value="">{isBisaya ? 'Pagpili og rehiyon' : 'Select a region'}</option>
                                            {regions.map((region) => (
                                                <option key={region} value={region}>
                                                    {region}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Service Availed */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t.service_availed}
                                        </label>
                                        <select
    value={data.respondent.service_availed}
    onChange={(e) => handleRespondentChange('service_availed', e.target.value)}
    className="..."
    required
>
    <option value="">{isBisaya ? 'Pagpili og serbisyo' : 'Select a service'}</option>
    {services.map((serviceName) => (
        <option key={serviceName} value={serviceName}>
            {isBisaya ? translateServiceName(serviceName) : serviceName}
        </option>
    ))}
</select>
                                    </div>

                                    {/* <input type="hidden" name="service_id" value={data.service_id} /> */}
                                </div>
                            </div>

                            {/* Citizen's Charter Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-red-100">
                                <div className="flex items-center mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {t.cc_awareness}
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {t.cc_description}
                                        </p>
                                    </div>
                                </div>

                                {/* CC1 Question */}
                                <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                        {t.cc1_title}
                                    </h3>
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((value) => (
                                            <label key={value} className="flex items-center p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-md">
                                                <input
                                                    type="radio"
                                                    name="cc1"
                                                    value={value.toString()}
                                                    checked={data.responses['CC1'] === value.toString()}
                                                    onChange={() => handleResponseChange('CC1', value.toString())}
                                                    className="h-5 w-5 text-blue-600 border-blue-300 focus:ring-blue-500 transition-colors"
                                                />
                                                <span className="ml-3 text-gray-700">
                                                    {t[`cc1_option${value}`]}
                                                    {value === 4 && (
                                                        <span className="text-gray-500 italic ml-2 text-sm">
                                                            {t.cc1_note}
                                                        </span>
                                                    )}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* CC2 Question */}
                                <div className={`mb-8 bg-blue-50 rounded-xl p-6 border border-blue-100 ${data.responses['CC1'] === '4' ? 'opacity-75' : ''}`}>
                                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                        {t.cc2_title}
                                    </h3>
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <label key={value} className={`flex items-center p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-md ${data.responses['CC1'] === '4' ? 'cursor-not-allowed opacity-50' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="cc2"
                                                    value={value.toString()}
                                                    checked={data.responses['CC2'] === value.toString()}
                                                    onChange={() => handleResponseChange('CC2', value.toString())}
                                                    disabled={data.responses['CC1'] === '4'}
                                                    className="h-5 w-5 text-blue-600 border-blue-300 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                                />
                                                <span className={`ml-3 ${data.responses['CC1'] === '4' ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    {t[`cc2_option${value}`]}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {data.responses['CC1'] === '4' && (
                                        <p className="mt-4 text-sm text-blue-600 italic bg-white/50 p-3 rounded-lg">
                                            <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {isBisaya
                                                ? 'Gisal-ot og "N/A" tungod kay imong gipili ang option 4 sa CC1.'
                                                : 'Automatically set to "N/A" because you selected option 4 in CC1.'}
                                        </p>
                                    )}
                                </div>

                                {/* CC3 Question */}
                                <div className={`bg-blue-50 rounded-xl p-6 border border-blue-100 ${data.responses['CC1'] === '4' ? 'opacity-75' : ''}`}>
                                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                                        {t.cc3_title}
                                    </h3>
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map((value) => (
                                            <label key={value} className={`flex items-center p-4 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-md ${data.responses['CC1'] === '4' ? 'cursor-not-allowed opacity-50' : ''}`}>
                                                <input
                                                    type="radio"
                                                    name="cc3"
                                                    value={value.toString()}
                                                    checked={data.responses['CC3'] === value.toString()}
                                                    onChange={() => handleResponseChange('CC3', value.toString())}
                                                    disabled={data.responses['CC1'] === '4'}
                                                    className="h-5 w-5 text-blue-600 border-blue-300 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                                />
                                                <span className={`ml-3 ${data.responses['CC1'] === '4' ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    {t[`cc3_option${value}`]}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Service Assessment Card */}
<div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-red-100">
  <div className="flex items-center mb-6">
    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">{t.service_assessment}</h2>
      <p className="text-sm text-gray-600 mt-1">{t.sqd_instructions}</p>
    </div>
  </div>

  {/* Rating Legend */}
  <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-red-200 p-2 sm:p-3 mb-4 rounded-t-xl shadow-md">
    <div className="flex flex-wrap gap-1 sm:gap-3 justify-center text-xs sm:text-sm">
      {responseOptions.map(opt => (
        <div key={opt.value} className="flex items-center space-x-1 bg-red-50 px-2 sm:px-3 py-1 rounded-full">
          <span className="font-bold text-red-700 text-xs sm:text-sm">{opt.short}</span>
          <span className="text-gray-700 hidden sm:inline">=</span>
          <span className="text-gray-600 hidden sm:inline text-xs">{opt.label}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Cards for all screen sizes */}
  <div className="space-y-4">
    {secondSetQuestions.map((question, index) => {
      const safeId = question.custom_id?.trim() || `sqd-${index}`;
      const questionText = isBisaya
        ? sqdBisayaTexts[question.custom_id] || question.question_text
        : question.question_text;

      return (
        <div key={safeId} className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start mb-3">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 font-bold text-xs mr-2 flex-shrink-0">
              {safeId}
            </span>
            <h4 className="text-sm font-medium text-gray-800">{questionText}</h4>
          </div>
          <div className="space-y-2">
            {responseOptions.map((option) => (
              <label
                key={`${safeId}-${option.value}`}
                className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-red-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`question_${safeId}`}
                  value={option.value}
                  checked={data.responses[question.custom_id] === option.value}
                  onChange={() => handleResponseChange(question.custom_id, option.value)}
                  className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500 mr-3"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</div>

                            {/* Optional Suggestions and Email Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-red-100">
                                <div className="space-y-8">
                                    {/* Suggestions */}
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                                                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {t.suggestions_title}
                                            </h3>
                                        </div>
                                        <textarea
                                            value={data.suggestions}
                                            onChange={handleSuggestionsChange}
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 resize-none"
                                            placeholder={isBisaya ? "Isuwat dinhi ang imong mga sugyot..." : "Write your suggestions here..."}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <div className="flex items-center mb-4">
                                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {t.email_title}
                                            </h3>
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={handleEmailChange}
                                            className="w-full border border-gray-300 rounded-xl shadow-sm px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                                            placeholder={isBisaya ? "example@email.com" : "example@email.com"}
                                        />
                                    </div>

                                    {/* Thank You Message */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 text-center">
                                        <div className="flex items-center justify-center mb-3">
                                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                </svg>
                                            </div>
                                            <h4 className="text-xl font-bold text-green-800">
                                                {t.thank_you}
                                            </h4>
                                        </div>
                                        <p className="text-green-700">
                                            {isBisaya
                                                ? "Daghang salamat sa imong panahon ug hinanaling feedback!"
                                                : "Thank you for your time and valuable feedback!"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Section */}
                            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-2xl">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-4">Ready to Submit Your Survey?</h3>
                                    <p className="text-red-100 text-lg">
                                        {isBisaya
                                            ? "Ang imong feedback makatabang sa pagpaayo sa serbisyo alang sa tanang Pilipino."
                                            : "Your feedback helps improve services for all Filipinos."}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start mb-2">
                                            <svg className="h-5 w-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">{t.confidential}</span>
                                        </div>
                                        <p className="text-red-200 text-sm">
                                            {isBisaya
                                                ? "Tanang impormasyon protektado ubos sa Data Privacy Act"
                                                : "All information protected under Data Privacy Act"}
                                        </p>
                                    </div>


                                    <button
    type="submit"
    disabled={processing || !allQuestionsAnswered}
    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-red-700 bg-white hover:bg-red-50 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
>
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t.submitting}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {t.submit_survey}
                                            </>
                                        )}
                                    </button>


                                </div>

                                {/* Anti-Palakasan Reminder */}
                                <div className="mt-8 pt-6 border-t border-white/20 text-center">
                                    <p className="text-sm text-red-100">
                                        🚫 <span className="font-bold">NO TO PALAKASAN</span> • 🚫 <span className="font-bold">NO TO FAVORITISM</span> • 🚫 <span className="font-bold">NO TO CORRUPTION</span>
                                    </p>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-12 pt-8 border-t border-red-200 text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                                <div className="flex items-center mb-4 sm:mb-0">
                                    <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-900">Anti-Red Tape Authority</h4>
                                        <p className="text-gray-600 text-sm">Republic of the Philippines</p>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-sm">
                                    This survey is conducted in compliance with Republic Act No. 11032 (Ease of Doing Business Act)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add animations to tailwind config (if not already present) */}
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
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>



    );

    console.log('secondSetQuestions custom_ids:', secondSetQuestions.map(q => q.custom_id));
}
