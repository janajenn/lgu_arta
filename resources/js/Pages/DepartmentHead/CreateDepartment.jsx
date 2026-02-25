import { useForm, usePage } from '@inertiajs/react';
import { BuildingOfficeIcon, UserIcon, EnvelopeIcon, KeyIcon, PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import DepartmentHeadLayout from '../../Shared/Layouts/DepartmentHeadLayout';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function CreateDepartment() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        department_name: '',
        department_description: '',
        logo: null,                 // ← new field for file
        user_name: '',
        user_email: '',
        user_password: '',
        user_password_confirmation: '',
        services: [{ name: '', description: '' }],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(null);
        }
    };

    const addService = () => {
        setData('services', [...data.services, { name: '', description: '' }]);
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
        post(route('department-head.departments.store'), {
            forceFormData: true,     // ← required for file upload
            onSuccess: () => {
                reset();
                setLogoPreview(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Department, Department Head, and services created successfully.',
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
        <DepartmentHeadLayout title="Create Department">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={submit} className="space-y-8">
                    {/* Department Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Department Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                                <input
                                    type="text"
                                    value={data.department_name}
                                    onChange={e => setData('department_name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Human Resources"
                                />
                                {errors.department_name && <p className="mt-1 text-sm text-red-600">{errors.department_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                                <textarea
                                    value={data.department_description}
                                    onChange={e => setData('department_description', e.target.value)}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Brief description of the department's function..."
                                />
                                {errors.department_description && <p className="mt-1 text-sm text-red-600">{errors.department_description}</p>}
                            </div>

                            {/* Logo upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department Logo (PNG only, required)</label>
                                <input
                                    type="file"
                                    accept="image/png"
                                    onChange={handleLogoChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {logoPreview && (
                                    <div className="mt-2">
                                        <img src={logoPreview} alt="Logo preview" className="h-20 w-20 object-contain border rounded" />
                                    </div>
                                )}
                                {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* User Section (Department Head) - unchanged */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                            Department Head Account
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.user_name}
                                        onChange={e => setData('user_name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.user_name && <p className="mt-1 text-sm text-red-600">{errors.user_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={data.user_email}
                                        onChange={e => setData('user_email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="head@example.com"
                                    />
                                </div>
                                {errors.user_email && <p className="mt-1 text-sm text-red-600">{errors.user_email}</p>}
                            </div>

                            {/* Password field with show/hide */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.user_password}
                                        onChange={e => setData('user_password', e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="••••••••"
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
                                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters, mixed case, numbers, and symbols recommended.</p>
                            </div>

                            {/* Confirm Password field with show/hide */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.user_password_confirmation}
                                        onChange={e => setData('user_password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.user_password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.user_password_confirmation}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Services Section - unchanged */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Services Offered
                            </h3>
                            <button
                                type="button"
                                onClick={addService}
                                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Service
                            </button>
                        </div>

                        {data.services.map((service, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-gray-700">Service #{index + 1}</span>
                                    {data.services.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeService(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Service Name</label>
                                        <input
                                            type="text"
                                            value={service.name}
                                            onChange={e => updateService(index, 'name', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., Issuance of Certificate"
                                        />
                                        {errors[`services.${index}.name`] && (
                                            <p className="mt-1 text-xs text-red-600">{errors[`services.${index}.name`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
                                        <textarea
                                            value={service.description}
                                            onChange={e => updateService(index, 'description', e.target.value)}
                                            rows="2"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Brief description of this service..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {errors.services && <p className="text-sm text-red-600">{errors.services}</p>}
                        {data.services.length === 0 && (
                            <p className="text-sm text-amber-600">At least one service is required.</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Create Department & User'}
                        </button>
                    </div>
                </form>
            </div>
        </DepartmentHeadLayout>
    );
}