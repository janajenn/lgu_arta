import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function ReportImprovementPlan({ notes, updateNote }) {
    return (
        <div id="improvement-plan" className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Continuous Agency Improvement Plan</h2>
            <div className="border-l-4 border-blue-400 pl-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                    Action Plan / Recommendations
                </label>
                <textarea
                    rows="5"
                    value={notes.improvementPlan}
                    onChange={(e) => updateNote('improvementPlan', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 print:border-0 print:p-0"
                    placeholder="List specific actions, timelines, and responsible persons to address low scores, low response rates, or unused services..."
                />
            </div>
        </div>
    );
}
