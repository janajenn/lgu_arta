export default function ReportTableOfContents() {
    const sections = [
        { id: 'overview', title: 'Overview' },
        { id: 'scope', title: 'Scope' },
        { id: 'data-interpretation', title: 'Data and Interpretation' },
        { id: 'improvement-plan', title: 'Continuous Agency Improvement Plan' },
        { id: 'annex', title: 'Annex A. Survey Questionnaire Used' },
    ];

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Table of Contents</h2>
            <ul className="space-y-3">
                {sections.map((section, idx) => (
                    <li key={section.id}>
                        <a href={`#${section.id}`} className="text-blue-600 hover:underline">
                            {idx + 1}. {section.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
