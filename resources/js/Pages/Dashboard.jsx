import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Welcome, {auth.user.name}!<br />
                            <Link
                                href={route('department-head.dashboard')}
                                className="text-blue-600 hover:underline mt-4 inline-block"
                            >
                                Go to Department Head Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}