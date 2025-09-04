import React from 'react';

const templates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Colorful and contemporary design with gradients',
        preview: '/api/placeholder/300/400',
        color: 'from-blue-500 to-purple-600'
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Professional and clean traditional layout',
        preview: '/api/placeholder/300/400',
        color: 'from-gray-600 to-gray-800'
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Eye-catching design with sidebar layout',
        preview: '/api/placeholder/300/400',
        color: 'from-pink-500 to-indigo-600'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and simple centered layout',
        preview: '/api/placeholder/300/400',
        color: 'from-gray-400 to-gray-600'
    }
];

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Choose a Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg ${selectedTemplate === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => onTemplateSelect(template.id)}
                    >
                        {/* Template Preview */}
                        <div className={`h-32 rounded-lg bg-gradient-to-br ${template.color} mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                            {template.name}
                        </div>

                        {/* Template Info */}
                        <h4 className="font-semibold text-gray-800 mb-1">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>

                        {/* Selection Indicator */}
                        {selectedTemplate === template.id && (
                            <div className="mt-3 flex items-center justify-center">
                                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                    ✓ Selected
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
