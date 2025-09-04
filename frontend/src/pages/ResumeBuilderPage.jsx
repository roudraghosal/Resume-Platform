import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FormField from '../components/FormField';
import TemplateSelector from '../components/TemplateSelector';
import ATSScanner from '../components/ATSScanner';
import ModernTemplate from '../components/templates/ModernTemplate';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import CreativeTemplate from '../components/templates/CreativeTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';

const initialPersonal = { name: '', email: '', phone: '', address: '', linkedin: '', github: '' };

const templateComponents = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
    minimal: MinimalTemplate
};

export default function ResumeBuilderPage() {
    const [step, setStep] = useState(0); // Start with template selection
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [personal, setPersonal] = useState(initialPersonal);
    const [education, setEducation] = useState([{ school: '', degree: '', duration: '' }]);
    const [experience, setExperience] = useState([{ company: '', role: '', description: '', duration: '' }]);
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedSkills, setSuggestedSkills] = useState([]);
    const [atsScore, setAtsScore] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // If editing, fetch resume
    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            const token = localStorage.getItem('token');
            axios.get(`/api/resume/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    const latest = res.data.versions[res.data.versions.length - 1];
                    setPersonal(latest.personal || initialPersonal);
                    setEducation(latest.education || [{ school: '', degree: '', duration: '' }]);
                    setExperience(latest.experience || [{ company: '', role: '', description: '', duration: '' }]);
                    setSkills(latest.skills || []);
                    setSelectedTemplate(latest.template || 'modern');
                });
        }
    }, [searchParams]);

    function handleSkillAdd() {
        if (skillInput && !skills.includes(skillInput)) {
            setSkills([...skills, skillInput]);
            setSkillInput('');
        }
    }

    function removeSkill(indexToRemove) {
        setSkills(skills.filter((_, index) => index !== indexToRemove));
    }

    async function handleSuggestSkills() {
        const token = localStorage.getItem('token');
        const res = await axios.post('/api/suggestion', {}, { headers: { Authorization: `Bearer ${token}` } });
        setSuggestedSkills(res.data.skills);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const id = searchParams.get('id');
        const payload = { personal, education, experience, skills, template: selectedTemplate };
        try {
            if (id) {
                await axios.put(`/api/resume/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post('/api/resume', payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving resume:', error);
        } finally {
            setLoading(false);
        }
    }

    const TemplateComponent = templateComponents[selectedTemplate];
    const resumeData = { personal, education, experience, skills };

    const steps = [
        'Choose Template',
        'Personal Details',
        'Education',
        'Experience',
        'Skills',
        'Preview'
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((stepName, index) => (
                            <div key={index} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${index <= step
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${index <= step ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                    {stepName}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-4 ${index < step ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            {steps[step]}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {step === 0 && (
                                <div>
                                    <TemplateSelector
                                        selectedTemplate={selectedTemplate}
                                        onTemplateSelect={setSelectedTemplate}
                                    />
                                    <button
                                        type="button"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                        onClick={() => setStep(1)}
                                    >
                                        Continue with {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template
                                    </button>
                                </div>
                            )}

                            {step === 1 && (
                                <div>
                                    <p className="text-gray-600 mb-6">Tell us about yourself</p>
                                    {Object.keys(personal).map(key => (
                                        <FormField
                                            key={key}
                                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                                            name={key}
                                            value={personal[key]}
                                            onChange={e => setPersonal({ ...personal, [key]: e.target.value })}
                                            required={key === 'name' || key === 'email'}
                                            placeholder={`Enter your ${key}`}
                                        />
                                    ))}
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(0)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(2)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <p className="text-gray-600 mb-6">Add your educational background</p>
                                    {education.map((ed, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-semibold text-gray-700">Education {idx + 1}</h4>
                                                {education.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <FormField
                                                label="School/University"
                                                value={ed.school}
                                                onChange={e => {
                                                    const arr = [...education];
                                                    arr[idx].school = e.target.value;
                                                    setEducation(arr);
                                                }}
                                                placeholder="Harvard University"
                                            />
                                            <FormField
                                                label="Degree"
                                                value={ed.degree}
                                                onChange={e => {
                                                    const arr = [...education];
                                                    arr[idx].degree = e.target.value;
                                                    setEducation(arr);
                                                }}
                                                placeholder="Bachelor of Computer Science"
                                            />
                                            <FormField
                                                label="Duration"
                                                value={ed.duration}
                                                onChange={e => {
                                                    const arr = [...education];
                                                    arr[idx].duration = e.target.value;
                                                    setEducation(arr);
                                                }}
                                                placeholder="2015-2019"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="w-full mb-6 bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg border-2 border-dashed border-green-300 transition-colors"
                                        onClick={() => setEducation([...education, { school: '', degree: '', duration: '' }])}
                                    >
                                        + Add Another Education
                                    </button>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(3)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div>
                                    <p className="text-gray-600 mb-6">Add your work experience</p>
                                    {experience.map((exp, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-semibold text-gray-700">Experience {idx + 1}</h4>
                                                {experience.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => setExperience(experience.filter((_, i) => i !== idx))}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <FormField
                                                label="Company"
                                                value={exp.company}
                                                onChange={e => {
                                                    const arr = [...experience];
                                                    arr[idx].company = e.target.value;
                                                    setExperience(arr);
                                                }}
                                                placeholder="Google Inc."
                                            />
                                            <FormField
                                                label="Role/Position"
                                                value={exp.role}
                                                onChange={e => {
                                                    const arr = [...experience];
                                                    arr[idx].role = e.target.value;
                                                    setExperience(arr);
                                                }}
                                                placeholder="Software Engineer"
                                            />
                                            <FormField
                                                label="Description"
                                                type="textarea"
                                                value={exp.description}
                                                onChange={e => {
                                                    const arr = [...experience];
                                                    arr[idx].description = e.target.value;
                                                    setExperience(arr);
                                                }}
                                                placeholder="Describe your responsibilities and achievements..."
                                            />
                                            <FormField
                                                label="Duration"
                                                value={exp.duration}
                                                onChange={e => {
                                                    const arr = [...experience];
                                                    arr[idx].duration = e.target.value;
                                                    setExperience(arr);
                                                }}
                                                placeholder="Jan 2020 - Present"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="w-full mb-6 bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg border-2 border-dashed border-green-300 transition-colors"
                                        onClick={() => setExperience([...experience, { company: '', role: '', description: '', duration: '' }])}
                                    >
                                        + Add Another Experience
                                    </button>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(2)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(4)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div>
                                    <p className="text-gray-600 mb-6">Add your skills and expertise</p>

                                    <div className="mb-6">
                                        <div className="flex gap-2 mb-4">
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={e => setSkillInput(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Add a skill (e.g., JavaScript, Leadership)"
                                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                                            />
                                            <button
                                                type="button"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                                                onClick={handleSkillAdd}
                                            >
                                                Add
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            className="mb-4 bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg font-semibold transition-colors"
                                            onClick={handleSuggestSkills}
                                        >
                                            ✨ Get AI Suggestions
                                        </button>

                                        {suggestedSkills.length > 0 && (
                                            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                                                <span className="font-semibold text-purple-800 block mb-2">Suggested Skills:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {suggestedSkills.map((skill, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-3 py-1 rounded-full text-sm transition-colors"
                                                            onClick={() => !skills.includes(skill) && setSkills([...skills, skill])}
                                                        >
                                                            + {skill}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium flex items-center gap-2"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(idx)}
                                                        className="text-blue-600 hover:text-blue-800 font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(3)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(5)}
                                        >
                                            Preview Resume
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <p className="text-gray-600">Review your resume, check ATS compatibility, and save</p>
                                    
                                    {/* ATS Scanner */}
                                    <ATSScanner 
                                        resumeData={resumeData} 
                                        onScoreUpdate={(score) => setAtsScore(score)} 
                                    />
                                    
                                    {/* ATS Score Display */}
                                    {atsScore && (
                                        <div className="bg-white rounded-lg shadow p-4 text-center">
                                            <div className="text-sm text-gray-600 mb-2">Current ATS Score</div>
                                            <div className={`text-2xl font-bold ${
                                                atsScore >= 80 ? 'text-green-600' : 
                                                atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                                {atsScore}%
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                                            onClick={() => setStep(4)}
                                        >
                                            Back to Edit
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : '💾 Save Resume'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Live Preview</h3>
                        <div className="transform scale-75 origin-top-left overflow-hidden">
                            {TemplateComponent && <TemplateComponent data={resumeData} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
