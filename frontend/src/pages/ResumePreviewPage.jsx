import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ATSScanner from '../components/ATSScanner';
import ModernTemplate from '../components/templates/ModernTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';

const templateComponents = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
    minimal: MinimalTemplate
};

export default function ResumePreviewPage() {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`/api/resume/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setResume(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching resume:', err);
                setLoading(false);
            });
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: resume?.versions[resume.versions.length - 1]?.personal?.name || 'Resume'
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume not found</h2>
                    <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const latest = resume.versions[resume.versions.length - 1];
    const templateType = latest.template || 'modern';
    const TemplateComponent = templateComponents[templateType];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header with actions */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Resume Preview</h1>
                        <p className="text-gray-600 mt-2">
                            Template: <span className="capitalize font-semibold">{templateType}</span>
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to={`/resume/new?id=${id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            ✏️ Edit Resume
                        </Link>
                        <button
                            onClick={handlePrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            📄 Download PDF
                        </button>
                        <Link
                            to="/dashboard"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            ← Dashboard
                        </Link>
                    </div>
                </div>

                {/* ATS Scanner */}
                <div className="mb-8">
                    <ATSScanner 
                        resumeData={latest} 
                        onScoreUpdate={(score) => console.log('ATS Score:', score)} 
                    />
                </div>

                {/* Resume Preview */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div ref={componentRef}>
                        {TemplateComponent ? (
                            <TemplateComponent data={latest} />
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-gray-500">Template not found. Using default layout.</p>
                                <div className="mt-4 text-left">
                                    <h2 className="text-2xl font-bold mb-2">{latest.personal?.name}</h2>
                                    <div className="mb-2">{latest.personal?.email} | {latest.personal?.phone}</div>
                                    <div className="mb-2">{latest.personal?.address}</div>
                                    <div className="mb-2">LinkedIn: {latest.personal?.linkedin} | GitHub: {latest.personal?.github}</div>

                                    <h3 className="font-semibold mt-4">Education</h3>
                                    <ul className="mb-2">
                                        {latest.education?.map((ed, idx) => (
                                            <li key={idx}>{ed.school}, {ed.degree} ({ed.duration})</li>
                                        ))}
                                    </ul>

                                    <h3 className="font-semibold mt-4">Experience</h3>
                                    <ul className="mb-2">
                                        {latest.experience?.map((exp, idx) => (
                                            <li key={idx}>{exp.company}, {exp.role} ({exp.duration})<br />{exp.description}</li>
                                        ))}
                                    </ul>

                                    <h3 className="font-semibold mt-4">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {latest.skills?.map((skill, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Version History */}
                {resume.versions.length > 1 && (
                    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Version History</h3>
                        <div className="space-y-2">
                            {resume.versions.map((version, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="font-medium">Version {idx + 1}</span>
                                        <span className="text-gray-500 ml-2">
                                            {new Date(version.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {idx === resume.versions.length - 1 && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Current
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
