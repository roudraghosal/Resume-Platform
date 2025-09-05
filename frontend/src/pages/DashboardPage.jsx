import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardCard from '../components/DashboardCard';
import AnalyticsChart from '../components/AnalyticsChart';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalResumes: 0,
        totalVersions: 0,
        templatesUsed: 0
    });

    async function fetchResumes() {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/resume', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const resumeData = res.data;
            setResumes(resumeData);

            // Calculate stats
            const totalVersions = resumeData.reduce((acc, resume) => acc + resume.versions.length, 0);
            const templatesUsed = new Set(resumeData.map(r =>
                r.versions[r.versions.length - 1].template || 'modern'
            )).size;

            setStats({
                totalResumes: resumeData.length,
                totalVersions,
                templatesUsed
            });
        } catch (error) {
            console.error('Error fetching resumes:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchResumes(); }, []);

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this resume?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/resume/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResumes(resumes.filter(r => r._id !== id));
            setStats(prev => ({
                ...prev,
                totalResumes: prev.totalResumes - 1
            }));
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Failed to delete resume. Please try again.');
        }
    }

    async function handleDownloadPDF(resumeId, fileName) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/resume/${resumeId}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}-resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF. Please try again.');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-1">Manage your resumes and track performance</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                to="/resume/new"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Create Resume
                            </Link>
                            <Link
                                to="/job-applications"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Job Applications
                            </Link>
                            <button
                                onClick={() => localStorage.removeItem('token') || window.location.reload()}
                                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <span className="text-2xl">📄</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Total Resumes</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.totalResumes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Total Versions</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.totalVersions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <span className="text-2xl">🎨</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Templates Used</h3>
                                <p className="text-3xl font-bold text-purple-600">{stats.templatesUsed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Chart */}
                {resumes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
                        <AnalyticsChart />
                    </div>
                )}

                {/* Resumes Grid */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
                        <div className="text-sm text-gray-500">
                            {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
                        </div>
                    </div>

                    {resumes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No resumes yet</h3>
                            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
                            <Link
                                to="/resume/new"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Your First Resume
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map((resume) => {
                                const latestVersion = resume.versions[resume.versions.length - 1];
                                const templateEmojis = {
                                    modern: '🎨',
                                    classic: '📋',
                                    creative: '✨',
                                    minimal: '🎯'
                                };

                                return (
                                    <div key={resume._id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">
                                                    {templateEmojis[latestVersion.template] || '📄'}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {latestVersion.personal?.name || 'Untitled Resume'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {latestVersion.template || 'modern'} template
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                v{resume.versions.length}
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-4">
                                            <p>📧 {latestVersion.personal?.email || 'No email'}</p>
                                            <p>📱 {latestVersion.personal?.phone || 'No phone'}</p>
                                            <p className="mt-2">
                                                💼 {latestVersion.experience?.length || 0} experience(s)
                                            </p>
                                            <p>🎓 {latestVersion.education?.length || 0} education(s)</p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/resume/${resume._id}/edit`}
                                                className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                to={`/resume/${resume._id}/preview`}
                                                className="flex-1 bg-green-600 text-white text-center py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                                            >
                                                Preview
                                            </Link>
                                            <button
                                                onClick={() => handleDownloadPDF(resume._id, latestVersion.personal?.name)}
                                                className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                                                title="Download PDF"
                                            >
                                                📁
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resume._id)}
                                                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
