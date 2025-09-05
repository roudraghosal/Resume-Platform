import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('appliedAt');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/autofill/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/autofill/applications/${applicationId}`, {
        applicationStatus: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, applicationStatus: newStatus }
            : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/autofill/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplications(prev => prev.filter(app => app._id !== applicationId));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      applied: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      applied: '📤',
      interview: '🗣️',
      rejected: '❌',
      accepted: '✅'
    };
    return emojis[status] || '📋';
  };

  const filteredApplications = applications
    .filter(app => filter === 'all' || app.applicationStatus === filter)
    .sort((a, b) => {
      if (sortBy === 'appliedAt') {
        return new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt);
      }
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      if (sortBy === 'position') {
        return a.position.localeCompare(b.position);
      }
      return 0;
    });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.applicationStatus] = (acc[app.applicationStatus] || 0) + 1;
    return acc;
  }, {});

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
              <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
              <p className="text-gray-600 mt-1">Track your job applications and their progress</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/dashboard"
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{statusCounts.interview || 0}</div>
            <div className="text-gray-600">Interviews</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{statusCounts.accepted || 0}</div>
            <div className="text-gray-600">Accepted</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected || 0}</div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="appliedAt">Application Date</option>
                <option value="company">Company Name</option>
                <option value="position">Position</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No job applications yet</h3>
              <p className="text-gray-600 mb-6">Start applying to jobs using the auto-fill feature!</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <div key={application._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.position}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus)}`}>
                          {getStatusEmoji(application.applicationStatus)} {application.applicationStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{application.company}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Applied: {new Date(application.appliedAt || application.createdAt).toLocaleDateString()}</span>
                        {application.jobUrl && (
                          <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Job Posting →
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={application.applicationStatus}
                        onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                      </select>
                      
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50 text-sm"
                      >
                        Details
                      </button>
                      
                      <button
                        onClick={() => deleteApplication(application._id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-300 hover:bg-red-50 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <Modal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedApplication(null);
          }}
          title={`${selectedApplication.position} at ${selectedApplication.company}`}
          size="xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.applicationStatus)}`}>
                  {getStatusEmoji(selectedApplication.applicationStatus)} {selectedApplication.applicationStatus}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                <p className="text-gray-900">
                  {new Date(selectedApplication.appliedAt || selectedApplication.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {selectedApplication.jobUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Job URL</label>
                <a
                  href={selectedApplication.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {selectedApplication.jobUrl}
                </a>
              </div>
            )}
            
            {selectedApplication.autoFillData && Object.keys(selectedApplication.autoFillData).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Fill Data Used</label>
                <div className="bg-gray-50 p-3 rounded max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(selectedApplication.autoFillData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobApplicationsPage;
