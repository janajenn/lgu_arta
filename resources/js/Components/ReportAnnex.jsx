export default function ReportAnnex({ firstSetQuestions, secondSetQuestions }) {
    return (
        <div id="annex" className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Annex A. Survey Questionnaire Used</h2>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Citizen's Charter (CC) Questions</h3>
                {firstSetQuestions.map((q, idx) => (
                    <div key={q.id} className="mb-3">
                        <p className="font-medium">{q.question_text}</p>
                        {/* Optionally display answer choices if needed – here we only list the question */}
                    </div>
                ))}
                <h3 className="text-lg font-semibold mt-4">Service Quality Dimensions (SQD)</h3>
                {secondSetQuestions.map((q, idx) => (
                    <div key={q.id} className="mb-3">
                        <p className="font-medium">{q.question_text}</p>
                    </div>
                ))}
                <p className="text-sm text-gray-500 mt-4">Respondents used a 5‑point Likert scale: Strongly Agree – Agree – Neither Agree nor Disagree – Disagree – Strongly Disagree (plus N/A option).</p>
            </div>
        </div>
    );
}
