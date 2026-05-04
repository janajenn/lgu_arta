import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FormulasModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col mt-8 md:mt-12">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">Formulas & Methodology</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="prose prose-sm max-w-none">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Summary</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>Response rate per service</strong> = (Survey Responses / Total Transactions) × 100</li>
                            <li><strong>Overall response rate</strong> = (Total Responses / Total Transactions) × 100</li>
                            <li><strong>Category breakdown</strong> = (Responses in category / Total Responses) × 100</li>
                            <li><strong>Most popular service</strong> = highest number of responses</li>
                            <li><strong>Highest response rate</strong> = highest (Responses / Transactions) (only services with ≥10 transactions)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Age Distribution</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>Percentage per age group</strong> = (Count in group / Total respondents) × 100</li>
                            <li><strong>Average age</strong> = (Sum of all ages) / (Number of respondents with age)</li>
                            <li><strong>Under 35%</strong> = (Respondents ≤35 / Total) × 100</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Client Type & Gender</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>Percentage per type/gender</strong> = (Count of type / Total respondents) × 100</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Region Distribution</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>Percentage per region</strong> = (Responses from region / Total respondents) × 100</li>
                            <li>Only top 10 regions shown.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">CC (Citizen's Charter)</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>Percentage per answer choice</strong> = (Count of answer / Total responses to that CC question) × 100</li>
                            <li><strong>CC Awareness</strong> = (Respondents who answered code "1" in CC1 / Total completed surveys) × 100</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">SQD (Service Quality Dimensions)</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>Valid responses</strong> = Total responses – N/A responses</li>
                            <li><strong>Positive responses</strong> = Strongly Agree + Agree (including Bisaya equivalents)</li>
                            <li><strong>Satisfaction score per dimension</strong> = (Positive / Valid) × 100</li>
                            <li><strong>Overall satisfaction</strong> = (Total positive across all dimensions / Total valid across all dimensions) × 100</li>
                            <li><strong>High N/A rate</strong> = N/A greater than 20% of total responses (alert)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Summary of Results (Metrics Cards)</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>CC Awareness, Visibility, Helpfulness</strong> = (Respondents who answered the specific "positive" code for that question) / Total completed surveys × 100</li>
                            <li><strong>Response Rate</strong> = (Total completed surveys / Total transactions) × 100</li>
                            <li><strong>Overall Score</strong> = (Total positive SQD responses / Total valid SQD responses) × 100</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Service Ratings (per service)</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li><strong>Rating per service</strong> = (Positive SQD responses for that service / Valid SQD responses for that service) × 100</li>
                            <li><strong>Overall Rating</strong> = aggregated over all services using the same formula.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Unused Services</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>A service is classified as "unused" if its <strong>Survey Responses == 0</strong> (no completed survey for that service).</li>
                        </ul>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> All percentages are rounded to one decimal place (or two where indicated). N/A responses are excluded from denominators in satisfaction scores.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
