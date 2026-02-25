// resources/js/Shared/Layouts/AuthenticatedLayout.jsx
import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { FiHome, FiFilePlus } from 'react-icons/fi';

export default function AuthenticatedLayout({ auth, header, children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
         

            

            {/* Header Section with Enhanced Styling - Full width */}
            {header && (
                <header className="bg-gradient-to-r from-white to-blue-50 shadow-sm border-b border-blue-100 w-full">
                    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
                        <div className="relative">
                            <div className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-navy-500 to-blue-700 rounded-full"></div>
                            <div className="pl-6">
                                <h1 className="text-3xl font-bold text-gray-800">{header}</h1>
                                <div className="mt-2 h-1 w-24 bg-gradient-to-r from-navy-500 to-blue-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content with Subtle Background Pattern - Full width */}
            <main className="relative overflow-hidden w-full">
                {/* Decorative background elements */}
                <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/20 to-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/20 to-white/10 rounded-full blur-3xl"></div>
                
                {/* Content Container - Full width */}
                <div className="relative w-full py-8 px-4 sm:px-6 lg:px-8">
                    {/* Option 1: Full width content with no max-width constraints */}
                    <div className="w-full">
                        {children}
                    </div>

                    {/* Option 2: If you want to keep a max-width for better readability on very large screens */}
                    {/* <div className="max-w-[1920px] mx-auto">
                        {children}
                    </div> */}

                    {/* Option 3: If you want different layouts for different page types */}
                    {/* {fullWidthPage ? (
                        <div className="w-full">
                            {children}
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-50 p-6 sm:p-8">
                                {children}
                            </div>
                        </div>
                    )} */}
                </div>
            </main>

          
        </div>
    );
}