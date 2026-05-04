import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function ReportScopeSection({ serviceSummaryData, notes, updateNote }) {
    return (
        <div id="scope" className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. SCOPE</h2>
            <div className="space-y-6">
                <div className="border-l-4 border-blue-400 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        Discussion / Analysis (before data)
                    </label>
                    <textarea
                        rows="3"
                        value={notes.scopeBefore}
                        onChange={(e) => updateNote('scopeBefore', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 print:border-0 print:p-0"
                        placeholder="Add discussion before the service summary table..."
                    />
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Summary</h3>
                    <div className="space-y-4">
                        {['internal', 'external'].map(cat => (
                            <div key={cat}>
                                <h4 className="text-lg font-medium capitalize mb-2">{cat} Services</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300 bg-white rounded-md">
                                        <thead className="bg-red-900 text-white">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Service Name</th>
                                                <th className="px-4 py-2 text-left">Survey Responses</th>
                                                <th className="px-4 py-2 text-left">Total Transactions</th>
                                                <th className="px-4 py-2 text-left">Response Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {serviceSummaryData.servicesByCategory[cat].map((s, idx) => (
                                                <tr key={s.name} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                    <td className="px-4 py-2">{s.name}</td>
                                                    <td className="px-4 py-2">{s.responses}</td>
                                                    <td className="px-4 py-2">{s.total_transactions}</td>
                                                    <td className="px-4 py-2">{s.response_rate}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
