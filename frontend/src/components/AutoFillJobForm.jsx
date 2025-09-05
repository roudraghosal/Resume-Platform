import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const AutoFillJobForm = ({ resumeData, isOpen, onClose, onAutoFillComplete }) => {
  const [jobFormData, setJobFormData] = useState({
    company: '',
    position: '',
    jobUrl: '',
    applicationData: {}
  });
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [commonFields, setCommonFields] = useState([]);
  const [customFields, setCustomFields] = useState([]);

  // Common job application fields that can be auto-filled
  const standardFields = [
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'phone', label: 'Phone Number', type: 'tel' },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'linkedin', label: 'LinkedIn Profile', type: 'url' },
    { key: 'github', label: 'GitHub Profile', type: 'url' },
    { key: 'portfolio', label: 'Portfolio Website', type: 'url' },
    { key: 'summary', label: 'Professional Summary', type: 'textarea' },
    { key: 'experience', label: 'Work Experience', type: 'textarea' },
    { key: 'education', label: 'Education', type: 'textarea' },
    { key: 'skills', label: 'Skills', type: 'textarea' },
    { key: 'coverLetter', label: 'Cover Letter', type: 'textarea' },
  ];

  useEffect(() => {
    if (resumeData && isOpen) {
      extractResumeData();
    }
  }, [resumeData, isOpen]);

  const extractResumeData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/autofill/extract', {
        resumeData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setExtractedData(response.data.extractedData);
      setCommonFields(response.data.commonFields);
    } catch (error) {
      console.error('Error extracting resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAutoFillData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/autofill/generate', {
        resumeData,
        jobData: {
          company: jobFormData.company,
          position: jobFormData.position,
          jobUrl: jobFormData.jobUrl
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setJobFormData(prev => ({
        ...prev,
        applicationData: response.data.autoFillData
      }));
    } catch (error) {
      console.error('Error generating auto-fill data:', error);
      alert('Failed to generate auto-fill data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldUpdate = (fieldKey, value) => {
    setJobFormData(prev => ({
      ...prev,
      applicationData: {
        ...prev.applicationData,
        [fieldKey]: value
      }
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(jobFormData.applicationData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `autofill-${jobFormData.company}-${jobFormData.position}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleComplete = () => {
    if (onAutoFillComplete) {
      onAutoFillComplete(jobFormData.applicationData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Auto-Fill Job Application" size="2xl">
      <div className="space-y-6">
        {/* Job Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
            💼 Job Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={jobFormData.company}
                onChange={(e) => setJobFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position Title
              </label>
              <input
                type="text"
                value={jobFormData.position}
                onChange={(e) => setJobFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter position title"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Posting URL (Optional)
            </label>
            <input
              type="url"
              value={jobFormData.jobUrl}
              onChange={(e) => setJobFormData(prev => ({ ...prev, jobUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://company.com/jobs/position"
            />
          </div>
          <button
            onClick={generateAutoFillData}
            disabled={loading || !jobFormData.company || !jobFormData.position}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Generating Auto-Fill Data...</span>
              </>
            ) : (
              '🤖 Generate Auto-Fill Data'
            )}
          </button>
        </div>

        {/* Auto-Fill Results */}
        {Object.keys(jobFormData.applicationData).length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-green-800 flex items-center">
                ✅ Auto-Fill Data Generated
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={exportAsJSON}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  📁 Export JSON
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              {standardFields.map(field => {
                const value = jobFormData.applicationData[field.key];
                if (!value) return null;
                
                return (
                  <div key={field.key} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start mb-2">
                      <label className="font-medium text-gray-700 text-sm">
                        {field.label}
                      </label>
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={value}
                        onChange={(e) => handleFieldUpdate(field.key, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                        rows={3}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={value}
                        onChange={(e) => handleFieldUpdate(field.key, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
            💡 How to Use Auto-Fill
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Enter job details and click "Generate Auto-Fill Data"</li>
            <li>• Review and edit the generated information</li>
            <li>• Click the 📋 button to copy individual fields to your clipboard</li>
            <li>• Paste the copied data into job application forms</li>
            <li>• Export as JSON for use with browser extensions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={Object.keys(jobFormData.applicationData).length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Complete Auto-Fill
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AutoFillJobForm;
