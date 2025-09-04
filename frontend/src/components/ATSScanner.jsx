import React, { useState } from 'react';
import axios from 'axios';

const ATSScanner = ({ resumeData, onScoreUpdate }) => {
  const [atsScore, setAtsScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/ats/analyze', {
        resume: resumeData,
        jobDescription
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAtsScore(response.data.score);
      setAnalysis(response.data.analysis);
      setShowAnalysis(true);
      if (onScoreUpdate) onScoreUpdate(response.data.score);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">🤖</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">ATS Score Analyzer</h3>
          <p className="text-gray-600">Check how well your resume passes Applicant Tracking Systems</p>
        </div>
      </div>

      {/* Job Description Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description (Optional - for better analysis)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to get personalized ATS recommendations..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyzeResume}
        disabled={loading || !resumeData}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Analyzing...
          </>
        ) : (
          '🔍 Analyze ATS Score'
        )}
      </button>

      {/* Results */}
      {showAnalysis && atsScore !== null && (
        <div className="mt-6 space-y-4">
          {/* Score Display */}
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${getScoreColor(atsScore)}`}>
              {atsScore}% - {getScoreLabel(atsScore)}
            </div>
          </div>

          {/* Score Breakdown */}
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  ✅ Strengths
                </h4>
                <ul className="space-y-1">
                  {analysis.strengths?.map((strength, index) => (
                    <li key={index} className="text-sm text-green-700">• {strength}</li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  ⚠️ Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {analysis.improvements?.map((improvement, index) => (
                    <li key={index} className="text-sm text-yellow-700">• {improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Detailed Analysis */}
          {analysis && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">📊 Detailed Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.keywordMatch || 0}%</div>
                  <div className="text-xs text-gray-600">Keyword Match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analysis.formatting || 0}%</div>
                  <div className="text-xs text-gray-600">Formatting</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analysis.sections || 0}%</div>
                  <div className="text-xs text-gray-600">Sections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{analysis.readability || 0}%</div>
                  <div className="text-xs text-gray-600">Readability</div>
                </div>
              </div>
            </div>
          )}

          {/* ATS Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              💡 ATS Optimization Tips
            </h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• Use standard section headings (Experience, Education, Skills)</li>
              <li>• Include relevant keywords from the job description</li>
              <li>• Use simple, clean formatting without complex graphics</li>
              <li>• Save as PDF to preserve formatting</li>
              <li>• Use standard fonts (Arial, Calibri, Times New Roman)</li>
              <li>• Include both acronyms and spelled-out versions of terms</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScanner;
