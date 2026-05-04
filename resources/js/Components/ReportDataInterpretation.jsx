import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function ReportDataInterpretation({
    ageDistributionData,
    regionData,
    clientTypeData,
    ccSqdData,
    serviceRatingsData,
    unusedServices,
    notes,
    updateNote,
}) {
    return (
        <div id="data-interpretation" className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. DATA AND INTERPRETATION</h2>
            <div className="space-y-8">
                {/* Discussion before demographic */}
                <div className="border-l-4 border-blue-400 pl-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                        Discussion / Analysis (before demographic data)
                    </label>
                    <textarea
                        rows="3"
                        value={notes.demographicBefore}
                        onChange={(e) => updateNote('demographicBefore', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 print:border-0 print:p-0"
                        placeholder="Add discussion before demographic tables..."
                    />
                </div>

                {/* A. Demographic Profile */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">A. Demographic Profile</h3>
                    <div className="space-y-6">
                        {/* Age Distribution */}
                        <div>
                            <h4 className="text-lg font-medium mb-2">Age Distribution</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 bg-white rounded-md">
                                    <thead className="bg-red-900 text-white">
                                        <tr><th className="px-4 py-2 text-left">Age Group</th><th className="px-4 py-2 text-left">Respondents</th><th className="px-4 py-2 text-left">Percentage</th></tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(ageDistributionData.ageDistribution).map(([group, data], idx) => (
                                            <tr key={group} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <td className="px-4 py-2">{group}</td>
                                                <td className="px-4 py-2">{data.count}</td>
                                                <td className="px-4 py-2">{data.percentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-100">
                                        <tr><td className="px-4 py-2 font-bold">Total</td><td className="px-4 py-2 font-bold">{ageDistributionData.total}</td><td>100%</td></tr>
                                    </tfoot>
                                </table>
                            </div>
                            {ageDistributionData.averageAge && <p className="mt-2 text-sm text-gray-600">Average Age: {ageDistributionData.averageAge} years</p>}
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Discussion</label>
                                <textarea rows="2" value={notes.ageDiscussion} onChange={(e) => updateNote('ageDiscussion', e.target.value)} className="w-full border rounded-lg p-2 print:border-0 print:p-0" placeholder="Interpretation..."></textarea>
                            </div>
                        </div>

                         {/* Region Distribution */}
                                                        <div>
                                                            <h4 className="text-lg font-medium mb-2">Region Distribution</h4>
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full border border-gray-300 bg-white rounded-md">
                                                                    <thead className="bg-red-900 text-white">
                                                                        <tr><th className="px-4 py-2 text-left">Region</th><th className="px-4 py-2 text-left">Respondents</th><th className="px-4 py-2 text-left">Percentage</th></tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {Object.entries(regionData.regions).map(([region, count], idx) => {
                                                                            const percent = regionData.total > 0 ? ((count / regionData.total) * 100).toFixed(1) : 0;
                                                                            return (
                                                                                <tr key={region} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                                                    <td className="px-4 py-2">{region}</td>
                                                                                    <td className="px-4 py-2">{count}</td>
                                                                                    <td className="px-4 py-2">{percent}%</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                    <tfoot className="bg-gray-100">
                                                                        <tr><td className="px-4 py-2 font-bold">Total</td><td className="px-4 py-2 font-bold">{regionData.total}</td><td className="px-4 py-2">100%</td></tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>
                                                            <div className="mt-3">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Discussion</label>
                                                                <textarea rows="2" value={notes.regionDiscussion} onChange={(e) => updateNote('regionDiscussion', e.target.value)} className="w-full border rounded-lg p-2" placeholder="Interpretation for region distribution..."></textarea>
                                                            </div>
                                                        </div>

                                                        {/* Client Type Distribution */}
                                                        <div>
                                                            <h4 className="text-lg font-medium mb-2">Client Type Distribution</h4>
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full border border-gray-300 bg-white rounded-md">
                                                                    <thead className="bg-red-900 text-white">
                                                                        <tr><th className="px-4 py-2 text-left">Client Type</th><th className="px-4 py-2 text-left">Respondents</th></tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {Object.entries(clientTypeData.clientTypes).map(([type, count], idx) => (
                                                                            <tr key={type} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                                                <td className="px-4 py-2 capitalize">{type}</td>
                                                                                <td className="px-4 py-2">{count}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="mt-3">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Discussion</label>
                                                                <textarea rows="2" value={notes.clientTypeDiscussion} onChange={(e) => updateNote('clientTypeDiscussion', e.target.value)} className="w-full border rounded-lg p-2" placeholder="Interpretation for client type distribution..."></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* B. Count of CC and SQD Results */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">B. Count of CC and SQD Results</h3>
                    <div className="border-l-4 border-blue-400 pl-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Discussion / Analysis (before CC/SQD tables)</label>
                        <textarea rows="2" value={notes.ccSqdBefore} onChange={(e) => updateNote('ccSqdBefore', e.target.value)} className="w-full border rounded-lg p-2 print:border-0 print:p-0" placeholder="Add discussion before CC and SQD tables..."></textarea>
                        <div className="space-y-4">
                                {/* CC Summary */}
                                <div>
                                    <h4 className="text-lg font-medium mb-2">Citizen's Charter (CC) Summary</h4>
                                    {Object.entries(ccSqdData.ccData).map(([qId, data]) => (
                                        <div key={qId} className="mb-4">
                                            <p className="font-medium text-gray-800">{data.question}</p>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full border border-gray-300 bg-white rounded-md text-sm">
                                                    <thead className="bg-red-900 text-white">
                                                        <tr><th className="px-2 py-1 text-left">Code</th><th className="px-2 py-1 text-left">Response</th><th className="px-2 py-1 text-left">Count</th><th className="px-2 py-1 text-left">%</th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.answer_stats.map((stat, idx) => (
                                                            <tr key={stat.code} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                                <td className="px-2 py-1">{stat.code}</td>
                                                                <td className="px-2 py-1">{stat.text}</td>
                                                                <td className="px-2 py-1">{stat.count}</td>
                                                                <td className="px-2 py-1">{stat.percentage}%</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Total: {data.total_responses}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* SQD Summary */}
                                <div>
                                    <h4 className="text-lg font-medium mb-2">Service Quality (SQD) Summary</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-300 bg-white rounded-md text-sm">
                                            <thead className="bg-red-900 text-white">
                                                <tr>
                                                    <th className="px-2 py-1 text-left">Dimension</th>
                                                    <th className="px-2 py-1 text-center">SA</th><th className="px-2 py-1 text-center">A</th>
                                                    <th className="px-2 py-1 text-center">N</th><th className="px-2 py-1 text-center">D</th>
                                                    <th className="px-2 py-1 text-center">SD</th><th className="px-2 py-1 text-center">N/A</th>
                                                    <th className="px-2 py-1 text-center">Total</th><th className="px-2 py-1 text-center">Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ccSqdData.sqdSummary.questions.map((q, idx) => (
                                                    <tr key={q.id} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                        <td className="px-2 py-1">{q.label}</td>
                                                        <td className="px-2 py-1 text-center">{q.counts['Strongly Agree']}</td>
                                                        <td className="px-2 py-1 text-center">{q.counts['Agree']}</td>
                                                        <td className="px-2 py-1 text-center">{q.counts['Neither Agree Nor Disagree']}</td>
                                                        <td className="px-2 py-1 text-center">{q.counts['Disagree']}</td>
                                                        <td className="px-2 py-1 text-center">{q.counts['Strongly Disagree']}</td>
                                                        <td className="px-2 py-1 text-center">{q.counts['N/A (Not Applicable)']}</td>
                                                        <td className="px-2 py-1 text-center">{q.total}</td>
                                                        <td className="px-2 py-1 text-center font-bold">{q.satisfaction_score}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-2 text-sm">Overall Satisfaction: {ccSqdData.sqdSummary.overall_satisfaction}%</div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Discussion / Analysis (after CC/SQD tables)</label>
                                <textarea rows="2" value={notes.ccSqdDiscussion} onChange={(e) => updateNote('ccSqdDiscussion', e.target.value)} className="w-full border rounded-lg p-2" placeholder="Add discussion after CC and SQD tables..."></textarea>
                            </div>
                        </div>
                        {/* C. Overall Score per Service */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">C. Overall Score per Service</h3>
                    <div className="border-l-4 border-blue-400 pl-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Discussion / Analysis (before service ratings)</label>
                        <textarea rows="2" value={notes.serviceRatingsBefore} onChange={(e) => updateNote('serviceRatingsBefore', e.target.value)} className="w-full border rounded-lg p-2 print:border-0 print:p-0" placeholder="Add discussion before service ratings table..."></textarea>
                    </div>
                    <div className="mb-3 p-3 bg-teal-50 rounded">Overall Rating: {serviceRatingsData.overallRating !== null ? `${serviceRatingsData.overallRating}%` : 'N/A'}</div>
                    {['internal', 'external'].map(cat => (
                        <div key={cat} className="mb-4">
                            <h4 className="font-semibold capitalize mb-2">{cat} Services</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 bg-white rounded-md">
                                    <thead className="bg-red-900 text-white">
                                        <tr><th className="px-4 py-2 text-left">Service</th><th className="px-4 py-2 text-left">Rating</th></tr>
                                    </thead>
                                    <tbody>
                                        {serviceRatingsData.serviceRatings.filter(s => s.category === cat).map((s, idx) => (
                                            <tr key={s.name} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <td className="px-4 py-2">{s.name}</td>
                                                <td className="px-4 py-2">{s.rating !== null ? `${s.rating}%` : 'No data'}</td>
                                            </tr   >
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><ChatBubbleLeftIcon className="h-4 w-4 mr-1" /> Discussion / Analysis (after service ratings)</label>
                        <textarea rows="2" value={notes.serviceRatingsDiscussion} onChange={(e) => updateNote('serviceRatingsDiscussion', e.target.value)} className="w-full border rounded-lg p-2 print:border-0 print:p-0" placeholder="Add discussion after service ratings..."></textarea>
                    </div>
                </div>

                {/* D. Unused Services */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">D. Unused Services</h3>
                    <div className="border-l-4 border-blue-400 pl-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                            Discussion / Analysis (before table)
                        </label>
                        <textarea rows="2" value={notes.unusedServicesDiscussion} onChange={(e) => updateNote('unusedServicesDiscussion', e.target.value)} className="w-full border rounded-lg p-2 print:border-0 print:p-0" placeholder="Add discussion about services with no survey responses..."/>
                    </div>
                    {unusedServices.length === 0 ? (
                        <p className="text-gray-500 italic">All services have received at least one survey response.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 bg-white rounded-md">
                                <thead className="bg-red-900 text-white">
                                    <tr><th className="px-4 py-2 text-left">Service Name</th><th className="px-4 py-2 text-left">Category</th><th className="px-4 py-2 text-left">Survey Responses</th><th className="px-4 py-2 text-left">Total Transactions</th></tr>
                                </thead>
                                <tbody>
                                    {unusedServices.map((service, idx) => (
                                        <tr key={service.name} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                            <td className="px-4 py-2">{service.name}</td>
                                            <td className="px-4 py-2 capitalize">{service.category}</td>
                                            <td className="px-4 py-2">{service.responses}</td>
                                            <td className="px-4 py-2">{service.total_transactions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                            Discussion / Analysis (after table)
                        </label>
                        <textarea rows="2" value={notes.unusedServicesDiscussionAfter} onChange={(e) => updateNote('unusedServicesDiscussionAfter', e.target.value)} className="w-full border rounded-lg p-2 print:border-0 print:p-0" placeholder="Add discussion about why these services have no responses..."/>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
