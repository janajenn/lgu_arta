import React from 'react';
import { router } from '@inertiajs/react';

export default function FilterBar({ filters, departments, ageBrackets }) {
    const [localFilters, setLocalFilters] = React.useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        department_id: filters.department_id || '',
        age_bracket: filters.age_bracket || '',
    });

    const handleChange = (e) => {
        setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.get('/perma-reports', localFilters, { preserveState: true, preserveScroll: true });
    };

    const handleReset = () => {
        setLocalFilters({
            start_date: '',
            end_date: '',
            department_id: '',
            age_bracket: '',
        });
        router.get('/perma-reports', {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        name="start_date"
                        value={localFilters.start_date}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        name="end_date"
                        value={localFilters.end_date}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                        name="department_id"
                        value={localFilters.department_id}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Bracket</label>
                    <select
                        name="age_bracket"
                        value={localFilters.age_bracket}
                        onChange={handleChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Ages</option>
                        {ageBrackets.map(bracket => (
                            <option key={bracket} value={bracket}>{bracket}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end gap-2">
                    <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        Apply
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}