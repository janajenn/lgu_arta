import { useForm, usePage, Link } from '@inertiajs/react';
import {
    BuildingOfficeIcon,
    UserIcon,
    EnvelopeIcon,
    KeyIcon,
    PlusIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
    CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import DepartmentHeadLayout from '../../../Shared/Layouts/DepartmentHeadLayout';
import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';

export default function EditDepartment({ department }) {
    const { flash } = usePage().props;

    // Transform the department data into the form structure
    const initialServices = department.services.map(s => ({
        id: s.id, // keep id to identify existing services
        name: s.name,
        description: s.description || '',
        category: s.category || 'internal',
    }));

    const { data, setData, put, processing, errors, reset } = useForm({
        department_name: department.name,
        department_description: department.description || '',
        logo: null, // will be a File object when changed
        user_name: department.head?.name || '',
        user_email: department.head?.email || '',
        user_password: '',
        user_password_confirmation: '',
        services: initialServices.length ? initialServices : [{ name: '', description: '', category: 'internal' }],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [logoPreview, setLogoPreview] = useState(department.logo ? `/storage/${department.logo}` : null);
    const [keepExistingLogo, setKeepExistingLogo] = useState(true);


    // Store initial data to compare changes
const initialFormData = useMemo(() => ({
    department_name: department.name,
    department_description: department.description || '',
    user_name: department.head?.name || '',
    user_email: department.head?.email || '',
    services: department.services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description || '',
        category: s.category || 'internal',
    })),
    logo: null, // we ignore logo in comparison because it's a file; changes will be detected separately
}), [department]);

// Check if any field has changed (except logo)
const hasChanges = useMemo(() => {
    // Compare department name/description
    if (data.department_name !== initialFormData.department_name) return true;
    if (data.department_description !== initialFormData.department_description) return true;

    // Compare head info
    if (data.user_name !== initialFormData.user_name) return true;
    if (data.user_email !== initialFormData.user_email) return true;
    if (data.user_password !== '' || data.user_password_confirmation !== '') return true; // password fields filled

    // Compare services (simple length and content check)
    if (data.services.length !== initialFormData.services.length) return true;
    for (let i = 0; i < data.services.length; i++) {
        const s1 = data.services[i];
        const s2 = initialFormData.services[i];
        if (!s2) return true;
        if (s1.name !== s2.name) return true;
        if (s1.description !== s2.description) return true;
        if (s1.category !== s2.category) return true;
    }

    // Check if new logo selected
    if (data.logo !== null) return true;

    return false;
}, [data, initialFormData]);


    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
                setKeepExistingLogo(false);
            };
            reader.readAsDataURL(file);
        } else {
            // If user cancels, revert to existing logo
            setLogoPreview(department.logo ? `/storage/${department.logo}` : null);
            setData('logo', null);
            setKeepExistingLogo(true);
        }
    };

    const addService = () => {
        setData('services', [...data.services, { name: '', description: '', category: 'internal' }]);
    };

    const removeService = (index) => {
        const updated = data.services.filter((_, i) => i !== index);
        setData('services', updated);
    };

    const updateService = (index, field, value) => {
        const updated = data.services.map((service, i) => {
            if (i === index) {
                return { ...service, [field]: value };
            }
            return service;
        });
        setData('services', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!hasChanges) {
            Swal.fire({
                icon: 'info',
                title: 'No Changes',
                text: 'You haven\'t made any changes to update.',
                timer: 3000,
            });
            return;
        }

        // If no new logo is selected, remove the logo field from the request
        // The backend will ignore it and keep the existing one.
        if (!data.logo) {
            delete data.logo;
        }

        put(route('department-head.departments.update', department.id), {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Department updated successfully.',
                    timer: 3000,
                    showConfirmButton: true,
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please check the form for errors and try again.',
                    timer: 5000,
                    showConfirmButton: true,
                });
            },
        });
    };

    return (
        <DepartmentHeadLayout title={`Edit ${department.name}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Edit Department</h2>
                    <p className="mt-2 text-gray-600">
                        Update the department details, department head information, and services.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Department Information Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                                Department Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.department_name}
                                    onChange={e => setData('department_name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder="e.g., Human Resources"
                                />
                                {errors.department_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.department_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-gray-400">(optional)</span>
                                </label>
                                <textarea
                                    value={data.department_description}
                                    onChange={e => setData('department_description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder="Brief description of the department's function..."
                                />
                                {errors.department_description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.department_description}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department Logo <span className="text-red-500">*</span> <span className="text-gray-400">(PNG only)</span>
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/png"
                                                onChange={handleLogoChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-between">
                                                <span className="truncate">
                                                    {data.logo ? data.logo.name : (keepExistingLogo ? 'Current logo (keep)' : 'Choose a new PNG file...')}
                                                </span>
                                                <CloudArrowUpIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </label>
                                    {logoPreview && (
                                        <div className="flex-shrink-0">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="h-16 w-16 object-contain border rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                                {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Department Head Account Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <UserIcon className="h-5 w-5 mr-2" />
                                Department Head Account
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.user_name}
                                        onChange={e => setData('user_name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.user_name && <p className="mt-1 text-sm text-red-600">{errors.user_name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={data.user_email}
                                        onChange={e => setData('user_email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                        placeholder="head@example.com"
                                    />
                                </div>
                                {errors.user_email && <p className="mt-1 text-sm text-red-600">{errors.user_email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password <span className="text-gray-400">(leave blank to keep current)</span>
                                    </label>
                                    <div className="relative">
                                        <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.user_password}
                                            onChange={e => setData('user_password', e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                            placeholder="New password (optional)"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.user_password && <p className="mt-1 text-sm text-red-600">{errors.user_password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={data.user_password_confirmation}
                                            onChange={e => setData('user_password_confirmation', e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.user_password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">{errors.user_password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                                Services Offered
                            </h3>
                            <button
                                type="button"
                                onClick={addService}
                                className="inline-flex items-center px-3 py-1.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium shadow-sm"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Service
                            </button>
                        </div>
                        <div className="p-6">
                            {data.services.length === 0 && (
                                <div className="text-center py-8">
                                    <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400" />
                                    <p className="mt-2 text-gray-500">No services added yet. Click "Add Service" to begin.</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {data.services.map((service, index) => (
                                    <div
                                        key={service.id || `new-${index}`}
                                        className="relative border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition-shadow"
                                    >
                                        <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            #{index + 1}
                                        </div>
                                        {data.services.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeService(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                                title="Remove service"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        <div className="grid grid-cols-1 gap-4 mt-2">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Service Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={service.name}
                                                    onChange={e => updateService(index, 'name', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                                    placeholder="e.g., Issuance of Certificate"
                                                />
                                                {errors[`services.${index}.name`] && (
                                                    <p className="mt-1 text-xs text-red-600">{errors[`services.${index}.name`]}</p>
                                                )}
                                            </div>

                                            {/* Category Dropdown */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Category <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={service.category}
                                                    onChange={e => updateService(index, 'category', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="internal">Internal</option>
                                                    <option value="external">External</option>
                                                </select>
                                                {errors[`services.${index}.category`] && (
                                                    <p className="mt-1 text-xs text-red-600">{errors[`services.${index}.category`]}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Description <span className="text-gray-400">(optional)</span>
                                                </label>
                                                <textarea
                                                    value={service.description}
                                                    onChange={e => updateService(index, 'description', e.target.value)}
                                                    rows="2"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                                    placeholder="Brief description of this service..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {errors.services && <p className="mt-2 text-sm text-red-600">{errors.services}</p>}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6">
                        <Link
                            href={route('department-head.departments.index')}
                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                'Update Department'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DepartmentHeadLayout>
    );
}