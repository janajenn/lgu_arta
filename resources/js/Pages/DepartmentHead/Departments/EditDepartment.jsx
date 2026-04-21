import { useForm, usePage, Link, router } from '@inertiajs/react';
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
import { useState, useMemo, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function EditDepartment({ department }) {
    const { flash } = usePage().props;

    const initialServices = department.services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description || '',
        category: s.category || 'internal',
    }));

    const { data, setData, processing, errors } = useForm({
        department_name: department.name,
        department_description: department.description || '',
        logo: null,
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
    const [logoFile, setLogoFile] = useState(null);
    const [showFloatingAddButton, setShowFloatingAddButton] = useState(false);
    const servicesCardRef = useRef(null);

    // Show floating button when the Services card is scrolled into view
    useEffect(() => {
        const handleScroll = () => {
            if (servicesCardRef.current) {
                const rect = servicesCardRef.current.getBoundingClientRect();
                const isVisible = rect.top < 150 && rect.bottom > 0;
                setShowFloatingAddButton(isVisible);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
    }), [department]);

    const hasChanges = useMemo(() => {
        if (data.department_name !== initialFormData.department_name) return true;
        if (data.department_description !== initialFormData.department_description) return true;
        if (data.user_name !== initialFormData.user_name) return true;
        if (data.user_email !== initialFormData.user_email) return true;
        if (data.user_password !== '' || data.user_password_confirmation !== '') return true;
        if (data.services.length !== initialFormData.services.length) return true;
        for (let i = 0; i < data.services.length; i++) {
            const s1 = data.services[i];
            const s2 = initialFormData.services[i];
            if (!s2) return true;
            if (s1.name !== s2.name) return true;
            if (s1.description !== s2.description) return true;
            if (s1.category !== s2.category) return true;
        }
        if (logoFile !== null) return true;
        return false;
    }, [data, initialFormData, logoFile]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogoFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
                setKeepExistingLogo(false);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoPreview(department.logo ? `/storage/${department.logo}` : null);
            setLogoFile(null);
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

        const formData = new FormData();
        formData.append('department_name', data.department_name);
        formData.append('department_description', data.department_description || '');
        formData.append('user_name', data.user_name);
        formData.append('user_email', data.user_email);
        if (data.user_password) {
            formData.append('user_password', data.user_password);
            formData.append('user_password_confirmation', data.user_password_confirmation);
        }
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        data.services.forEach((service, index) => {
            formData.append(`services[${index}][name]`, service.name);
            formData.append(`services[${index}][category]`, service.category);
            formData.append(`services[${index}][description]`, service.description || '');
            if (service.id) {
                formData.append(`services[${index}][id]`, service.id);
            }
        });

        const url = route('department-head.departments.update', department.id) + '?_method=PUT';
        router.post(url, formData, {
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
                const errorList = Object.entries(errors).map(([field, message]) => {
                    const fieldName = field
                        .replace('department_name', 'Department Name')
                        .replace('department_description', 'Description')
                        .replace('user_name', 'Full Name')
                        .replace('user_email', 'Email')
                        .replace('logo', 'Logo')
                        .replace('services', 'Services');
                    return `• ${fieldName}: ${message}`;
                }).join('<br>');
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    html: errorList || 'Please check the form for errors and try again.',
                    timer: 7000,
                    showConfirmButton: true,
                });
            },
        });
    };

    return (
        <DepartmentHeadLayout title={`Edit ${department.name}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Edit Department</h2>
                    <p className="mt-2 text-gray-600">
                        Update the department details, focal person information, and services.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Two‑column layout for Department Info and Focal Person */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                    {errors.department_name && <p className="mt-1 text-sm text-red-600">{errors.department_name}</p>}
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
                                    {errors.department_description && <p className="mt-1 text-sm text-red-600">{errors.department_description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Department Logo <span className="text-gray-400">(optional, PNG only)</span>
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
                                                        {logoFile ? logoFile.name : (keepExistingLogo ? 'Current logo (keep)' : 'Choose a new PNG file...')}
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
                                    <p className="mt-1 text-xs text-gray-500">
                                        Leave empty to keep the current logo. Only PNG files, max 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Focal Person Account Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <UserIcon className="h-5 w-5 mr-2" />
                                    Focal Person Account
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
                    </div>

                    {/* Services Card – compact row layout */}
                    <div ref={servicesCardRef} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
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
                            {data.services.length === 0 ? (
                                <div className="text-center py-8">
                                    <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400" />
                                    <p className="mt-2 text-gray-500">No services added yet. Click "Add Service" to begin.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Table header (desktop) */}
                                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="col-span-4">Service Name</div>
                                        <div className="col-span-2">Category</div>
                                        <div className="col-span-5">Description</div>
                                        <div className="col-span-1 text-right">Actions</div>
                                    </div>

                                    {data.services.map((service, index) => (
                                        <div
                                            key={service.id || `new-${index}`}
                                            className="relative border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition-shadow md:grid md:grid-cols-12 md:gap-4 md:items-center"
                                        >
                                            {/* Mobile view */}
                                            <div className="md:hidden space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Service Name <span className="text-red-500">*</span>
                                                    </label>
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
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Brief description..."
                                                    />
                                                </div>
                                            </div>

                                            {/* Desktop compact grid */}
                                            <div className="hidden md:block md:col-span-4">
                                                <input
                                                    type="text"
                                                    value={service.name}
                                                    onChange={e => updateService(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="Service name"
                                                />
                                                {errors[`services.${index}.name`] && (
                                                    <p className="mt-1 text-xs text-red-600">{errors[`services.${index}.name`]}</p>
                                                )}
                                            </div>
                                            <div className="hidden md:block md:col-span-2">
                                                <select
                                                    value={service.category}
                                                    onChange={e => updateService(index, 'category', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                >
                                                    <option value="internal">Internal</option>
                                                    <option value="external">External</option>
                                                </select>
                                                {errors[`services.${index}.category`] && (
                                                    <p className="mt-1 text-xs text-red-600">{errors[`services.${index}.category`]}</p>
                                                )}
                                            </div>
                                            <div className="hidden md:block md:col-span-5">
                                                <input
                                                    type="text"
                                                    value={service.description}
                                                    onChange={e => updateService(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    placeholder="Description (optional)"
                                                />
                                            </div>
                                            <div className="hidden md:block md:col-span-1 text-right">
                                                {data.services.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeService(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        title="Remove service"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Mobile delete button */}
                                            <div className="absolute top-2 right-2 md:hidden">
                                                {data.services.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeService(index)}
                                                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                                        title="Remove service"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.services && <p className="mt-4 text-sm text-red-600">{errors.services}</p>}
                        </div>
                    </div>

                    {/* Floating Add Service Button */}
                    {showFloatingAddButton && (
                        <button
                            type="button"
                            onClick={addService}
                            className="fixed bottom-24 right-6 z-50 inline-flex items-center px-5 py-3 bg-gradient-to-r from-black to-blue-700 text-white rounded-full shadow-xl hover:from-black hover:to-black hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none"
                            title="Add a new service"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">Add Service</span>
                        </button>
                    )}

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
