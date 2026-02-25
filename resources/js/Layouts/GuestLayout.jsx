import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Optional header/navigation */}
            {/* <div className="px-4 sm:px-6 lg:px-8 py-4">
                <Link href="/">
                    <ApplicationLogo className="h-16 w-16 fill-current text-gray-500" />
                </Link>
            </div> */}

            <main className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Full width container with some padding */}
                <div className="w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}