export default function ReportTitlePage({ lguLogo }) {
    return (
        <div className="text-center py-20 print:py-10">
            {lguLogo && (
                <img src={lguLogo} alt="LGU Logo" className="h-32 mx-auto mb-6" />
            )}
            <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-wider">
                Local Government Unit of Opol
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">
                Client Satisfaction Measurement Report
            </h2>
            <h3 className="text-xl text-gray-500 mt-2">(CSMR)</h3>
            <p className="mt-8 text-gray-400">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    );
}
