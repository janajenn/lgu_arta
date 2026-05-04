import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function ReportOverviewSection({ summaryData, notes, updateNote }) {
    return (
        <div id="overview" className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. OVERVIEW</h2>
            <div className="space-y-6">
                {/* Discussion before */}
                <div className="border-l-4 border-blue-400 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        Discussion / Analysis (before data)
                    </label>
                    <textarea
                        rows="3"
                        value={notes.overviewBefore}
                        onChange={(e) => updateNote('overviewBefore', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 print:border-0 print:p-0"
                        placeholder="Add discussion before the data table..."
                    />
                </div>

                {/* Summary of Results */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Summary of Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        <div className="p-3 bg-blue-50 rounded"><p className="text-xs">CC Awareness</p><p className="text-xl font-bold">{summaryData.metrics.cc_awareness}%</p></div>
                        <div className="p-3 bg-green-50 rounded"><p className="text-xs">CC Visibility</p><p className="text-xl font-bold">{summaryData.metrics.cc_visibility}%</p></div>
                        <div className="p-3 bg-purple-50 rounded"><p className="text-xs">CC Helpfulness</p><p className="text-xl font-bold">{summaryData.metrics.cc_helpfulness}%</p></div>
                        <div className="p-3 bg-amber-50 rounded"><p className="text-xs">Response Rate</p><p className="text-xl font-bold">{summaryData.metrics.response_rate}%</p></div>
                        <div className="p-3 bg-emerald-50 rounded"><p className="text-xs">Overall Score</p><p className="text-xl font-bold">{summaryData.metrics.overall_score}%</p></div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                        <p className="whitespace-pre-line">{summaryData.insightParagraph}</p>
                    </div>
                </div>

                {/* Discussion after */}
                <div className="border-l-4 border-blue-400 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        Discussion / Analysis (after data)
                    </label>
                    <textarea
                        rows="3"
                        value={notes.overviewAfter}
                        onChange={(e) => updateNote('overviewAfter', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 print:border-0 print:p-0"
                        placeholder="Add discussion after the data table..."
                    />
                </div>
            </div>
        </div>
    );
}
