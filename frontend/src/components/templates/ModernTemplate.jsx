import React from 'react';

export default function ModernTemplate({ data }) {
    const { personal, education, experience, skills } = data;

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                        {personal?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2">{personal?.name || 'Your Name'}</h1>
                        <p className="text-xl opacity-90 mb-2">{personal?.email || 'your.email@example.com'}</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                            {personal?.phone && <span>📞 {personal.phone}</span>}
                            {personal?.linkedin && <span>💼 LinkedIn</span>}
                            {personal?.github && <span>💻 GitHub</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Education Section */}
                {education?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
                            🎓 Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">{edu.school}</h3>
                                            <p className="text-blue-600 font-medium">{edu.degree}</p>
                                        </div>
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {edu.duration}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience Section */}
                {experience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-600 pb-2">
                            💼 Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp, idx) => (
                                <div key={idx} className="border-l-4 border-purple-600 pl-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-800">{exp.role}</h3>
                                            <p className="text-purple-600 font-medium text-lg">{exp.company}</p>
                                        </div>
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                            {exp.duration}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills Section */}
                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-600 pb-2">
                            🚀 Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
