import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function InsightsCard({ insights, title = 'Key Insights', icon: Icon = LightBulbIcon }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!insights || insights.length === 0) return null;

    const paragraph = insights.join(' ');

    return (
        <div
            className={`
                relative overflow-hidden
                bg-gradient-to-br from-blue-50 via-white to-indigo-50
                border border-indigo-200/50 rounded-2xl p-6 mb-8
                shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)]
                transition-all duration-500 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
        >
            {/* decorative elements (unchanged) */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {title}
                    </h3>
                </div>

                <div className="pl-2">
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg font-light tracking-wide">
                        {paragraph}
                    </p>
                </div>

                <div className="mt-4 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
                <p className="mt-3 text-xs text-gray-400 font-mono">
                    AI‑powered analysis • based on current data
                </p>
            </div>
        </div>
    );
}
