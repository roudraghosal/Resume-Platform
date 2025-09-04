import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashboardCard({ resume, onDelete }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const latest = resume.versions[resume.versions.length - 1];
    const templateType = latest.template || 'modern';

    const templateColors = {
        modern: 'from-blue-500 to-purple-600',
        classic: 'from-gray-600 to-gray-800',
        creative: 'from-pink-500 to-indigo-600',
        minimal: 'from-gray-400 to-gray-600'
    };

    const handleDelete = () => {
        if (showDeleteConfirm) {
            onDelete(resume._id);
            setShowDeleteConfirm(false);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Template Preview Header */}
            <div className={`h-24 bg-gradient-to-r ${templateColors[templateType]} flex items-center justify-center text-white font-bold text-lg`}>
                <span className="capitalize">{templateType} Template</span>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                        {latest.personal?.name || 'Untitled Resume'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {latest.personal?.email || 'No email provided'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {resume.versions.length} version{resume.versions.length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-gray-500 text-xs">
                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Skills Preview */}
                {latest.skills && latest.skills.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {latest.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {skill}
                                </span>
                            ))}
                            {latest.skills.length > 3 && (
                                <span className="text-gray-500 text-xs px-2 py-1">
                                    +{latest.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <Link
                        to={`/resume/${resume._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                    >
                        👁️ View
                    </Link>
                    <Link
                        to={`/resume/new?id=${resume._id}`}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                    >
                        ✏️ Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-colors text-sm ${showDeleteConfirm
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                        onBlur={() => setTimeout(() => setShowDeleteConfirm(false), 200)}
                    >
                        {showDeleteConfirm ? '⚠️ Confirm' : '🗑️ Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
