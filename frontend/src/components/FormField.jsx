import React from 'react';

export default function FormField({ label, type = 'text', value, onChange, name, placeholder, required = false, error }) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${error ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
            )}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
