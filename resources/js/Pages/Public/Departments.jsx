import { Head, Link } from '@inertiajs/react';
import { BuildingOfficeIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

// =============================================
// BRAND COLORS – Replace with your logo's actual colors
// =============================================
const brand = {
  primary: '#1e3a8a',
  secondary: '#2563eb',
  accent: '#f59e0b',
  light: '#dbeafe',
  gradientFrom: '#1e3a8a',
  gradientTo: '#3b82f6',
};

// =============================================
// LOGO PATHS – Use your actual filenames
// =============================================
const leftLogoSrc = '/images/hr.png';
const rightLogoSrc = '/images/opol_logo.png';
const usePlaceholder = false;

export default function Departments({ departments }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDepartments, setFilteredDepartments] = useState(departments);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const filtered = departments.filter(dept =>
                dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredDepartments(filtered);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, departments]);

    const clearSearch = () => setSearchTerm('');

    return (
        <>
            <Head title="Welcome to Opol Feedback Portal" />

            <div className="relative"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='double' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 0 0 L 100 0' stroke='%23999999' stroke-width='0.8' stroke-opacity='0.06' /%3E%3Cpath d='M 0 2 L 100 2' stroke='%23999999' stroke-width='0.8' stroke-opacity='0.06' /%3E%3Cpath d='M 0 0 L 0 100' stroke='%23999999' stroke-width='0.8' stroke-opacity='0.06' /%3E%3Cpath d='M 2 0 L 2 100' stroke='%23999999' stroke-width='0.8' stroke-opacity='0.09' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23double)' /%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            >
                {/* Hero Section – Responsive */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-center px-4 isolate">
                    {/* Layer 2: Logos – hidden on mobile, visible on larger screens */}
                    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
                        <div className="absolute left-0 top-0 h-full" style={{ width: '130%', left: '-65%', zIndex: 2 }}>
                            {usePlaceholder ? (
                                <div className="w-full h-full bg-white/20 rounded-full border-2 border-white/30"></div>
                            ) : (
                                <img src={leftLogoSrc} alt="" className="w-full h-full object-contain opacity-20 blur-sm" />
                            )}
                        </div>
                        <div className="absolute right-0 top-0 h-full" style={{ width: '120%', right: '-60%', zIndex: 2 }}>
                            {usePlaceholder ? (
                                <div className="w-full h-full bg-white/20 rounded-full border-2 border-white/30"></div>
                            ) : (
                                <img src={rightLogoSrc} alt="" className="w-full h-full object-contain opacity-20 blur-sm" />
                            )}
                        </div>
                    </div>

                    {/* Noise texture */}
                    <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")` }}></div>

                    {/* Content container – responsive padding */}
                    <div className="relative z-20 max-w-3xl mx-auto w-full bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 border border-white/20 shadow-2xl">
                        {/* Municipality Badge */}
                        <div className="mb-4 sm:mb-6 inline-block bg-white/20 backdrop-blur-md px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full border border-white/30 shadow-lg">
                            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-black tracking-wider">
                                MUNICIPALITY OF OPOL
                            </h2>
                            <p className="text-black/90 text-[8px] sm:text-xs mt-0.5">Province of Misamis Oriental</p>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-2 sm:mb-4 tracking-tight drop-shadow-2xl animate-fade-in">
                            Share Your Feedback
                        </h1>

                        <div className="mb-4 sm:mb-6">
                            <h4 className="text-lg sm:text-2xl md:text-3xl font-bold text-black flex items-center justify-center gap-2 flex-wrap">
                                <span>Customer Satisfaction Rating</span>
                            </h4>
                            <p className="text-black/90 text-xs sm:text-sm md:text-base lg:text-xl max-w-2xl mx-auto mt-1 sm:mt-2 px-2">
                                Your ratings directly influence how we improve our services. Every score matters.
                            </p>
                        </div>

                        {/* Search Bar – responsive */}
                        <div className="relative max-w-xl mx-auto mb-4 sm:mb-6 animate-fade-in animation-delay-600">
                            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-black/60" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Find a department..."
                                className="block w-full pl-9 sm:pl-12 pr-9 sm:pr-12 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base border border-black/30 rounded-full bg-white/20 backdrop-blur-md text-black placeholder-black/70 shadow-xl focus:ring-4 focus:ring-black/30 focus:border-transparent transition-all"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-black/60 hover:text-black"
                                >
                                    <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            )}
                        </div>

                        <p className="text-black/80 text-xs sm:text-sm animate-fade-in animation-delay-900">
                            {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'} available
                        </p>
                    </div>

                    {/* Scroll indicator – hidden on very small screens */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden sm:block">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* Departments Section – Responsive grid */}
                <section className="py-12 sm:py-16 md:py-20 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 sm:mb-12 md:mb-16">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Our Departments</h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                                Select a department to provide your valuable feedback. We're here to listen and improve.
                            </p>
                            <span className="mt-3 sm:mt-4 inline-block px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full"
                                  style={{ backgroundColor: brand.light, color: brand.primary }}>
                                {filteredDepartments.length} {filteredDepartments.length === 1 ? 'department' : 'departments'} available
                            </span>
                        </div>

                     {filteredDepartments.length > 0 ? (
    <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:space-y-0">
        {filteredDepartments.map((dept, index) => {
            const delay = index * 100;
            return (
                <Link
                    key={dept.id}
                    href={route('public.department.show', dept.id)}
                    className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden border border-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 block ${
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    } transition-all duration-700 ease-out`}
                    style={{ transitionDelay: `${delay}ms` }}
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 group-hover:h-2.5 transition-all duration-300"
                         style={{ background: `linear-gradient(to right, ${brand.primary}, ${brand.secondary})` }}></div>

                    {/* Horizontal layout on mobile, vertical on larger screens */}
                    <div className="p-4 sm:p-5 md:p-6 flex flex-row items-center gap-4 md:flex-col md:text-center">
                        {/* Icon / Logo */}
                        <div className="flex-shrink-0">
                            {dept.logo ? (
                                <img
                                    src={dept.logo}
                                    alt={dept.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-contain bg-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                                     style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.secondary})` }}>
                                    <BuildingOfficeIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Text content */}
                        <div className="flex-1 md:text-center">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 transition-colors"
                                onMouseEnter={(e) => e.currentTarget.style.color = brand.primary}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                                {dept.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                                {dept.description || 'Dedicated to providing exceptional services.'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 md:justify-center">
                                <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                                      style={{ backgroundColor: brand.light }}></span>
                                <span>{dept.services_count} service{dept.services_count !== 1 ? 's' : ''}</span>
                            </div>
                        </div>

                        {/* Button – hidden on mobile (optional), keep only on larger screens */}
                        <div className="hidden md:block mt-4">
                            <span className="px-4 py-2 text-white rounded-full text-xs font-medium group-hover:scale-105 transition-transform shadow-md"
                                  style={{ background: `linear-gradient(to right, ${brand.primary}, ${brand.secondary})` }}>
                                Select & Feedback
                            </span>
                        </div>
                    </div>

                    {/* Mobile-only button – full width at bottom */}
                    <div className="block md:hidden p-3 border-t border-gray-100">
                        <span className="block w-full text-center py-2 text-white rounded-lg text-sm font-medium"
                              style={{ background: `linear-gradient(to right, ${brand.primary}, ${brand.secondary})` }}>
                            Select & Feedback
                        </span>
                    </div>

                    <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
                         style={{ background: `linear-gradient(to bottom, ${brand.primary}, ${brand.secondary})` }}></div>
                </Link>
            );
        })}
    </div>
) : (
                            <div className="text-center py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
                                <BuildingOfficeIcon className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-300 animate-float-slow mb-4 sm:mb-6" />
                                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Departments Found</h3>
                                <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto mb-4 sm:mb-6 px-4">
                                    {searchTerm ? `No results for "${searchTerm}". Try another search.` : 'Departments coming soon. Check back later!'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="px-6 sm:px-8 py-2.5 sm:py-4 text-white rounded-full hover:opacity-90 transition-all shadow-lg text-sm sm:text-base"
                                        style={{ backgroundColor: brand.primary }}
                                    >
                                        Reset Search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer – responsive */}
                <footer className="py-6 sm:py-8 bg-white/10 backdrop-blur-md border-t border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-black/80 text-sm sm:text-base md:text-lg mb-2">
                            Developed with <span className="animate-heartbeat" style={{ color: brand.accent }}>❤️</span> by the HRMO Team
                        </p>
                        <p className="text-black/60 text-xs sm:text-sm">
                            © {new Date().getFullYear()} Municipality of Opol. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>

            {/* Custom Animations – unchanged */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-slower {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(20px); }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.1); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.1); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-fade-in { animation: fade-in 1s ease-out forwards; }
                .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
                .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
                .animate-pulse-glow { animation: pulse-glow 5s ease-in-out infinite; }
                .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
                .animate-bounce { animation: bounce 2s ease-in-out infinite; }
                .animation-delay-300 { animation-delay: 0.3s; }
                .animation-delay-600 { animation-delay: 0.6s; }
                .animation-delay-900 { animation-delay: 0.9s; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}</style>
        </>
    );
}
