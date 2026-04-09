import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function InsufficientResponsesModal({
    isOpen,
    onClose,
    totalResponses,
    minRequired,
    totalTransactions,
    onLearnMore,
}) {
    const [isVisible, setIsVisible] = useState(false);

    // Prevent background scrolling when modal is open and handle entrance animation
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Small delay to trigger entrance animation
            setTimeout(() => setIsVisible(true), 10);
        } else {
            document.body.style.overflow = '';
            setIsVisible(false);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const percentage = Math.min(Math.round((totalResponses / minRequired) * 100), 100);

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[9999] flex items-start justify-center p-4 pt-16 transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
            >
                {/* Header – Red gradient for urgency */}
                <div className="relative px-6 py-5 bg-gradient-to-r from-red-600 to-red-700">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Insufficient Responses</h3>
                                <p className="text-sm text-red-100">Immediate action recommended</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Your department currently has <span className="font-semibold text-gray-900">{totalResponses}</span> survey responses,
                        but the statistically recommended minimum is <span className="font-semibold text-gray-900">{minRequired}</span> based on your
                        total transactions (<span className="font-semibold text-gray-900">{totalTransactions}</span>).
                    </p>
                    <p className="text-gray-600 mb-6 text-sm">
                        To ensure reliable and representative results, please encourage more customers to complete the survey.
                    </p>

                    {/* Progress bar – Red gradient */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Current progress</span>
                            <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {totalResponses} of {minRequired} responses collected
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            Dismiss
                        </button>
                        {onLearnMore && (
                            <button
                                onClick={onLearnMore}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                            >
                                Learn more
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
