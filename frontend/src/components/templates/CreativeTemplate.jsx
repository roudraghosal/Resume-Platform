import React from 'react';

export default function CreativeTemplate({ data }) {
    const { personal, education, experience, skills } = data;

    return (
        <div className="bg-gradient-to-br from-pink-50 to-indigo-100 max-w-4xl mx-auto shadow-2xl rounded-3xl overflow-hidden">
            {/* Sidebar */}
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-8">
                    {/* Profile */}
                    <div className="text-center mb-8">
                        <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                            {personal?.name?.charAt(0) || 'U'}
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{personal?.name || 'Your Name'}</h1>
                        <div className="h-1 w-16 bg-pink-300 mx-auto rounded"></div>
                    </div>

                    {/* Contact */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <span className="mr-2">📧</span> Contact
                        </h3>
                        <div className="space-y-2 text-sm">
                            {personal?.email && (
                                <p className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-300 rounded-full mr-2"></span>
                                    {personal.email}
                                </p>
                            )}
                            {personal?.phone && (
                                <p className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-300 rounded-full mr-2"></span>
                                    {personal.phone}
                                </p>
                            )}
                            {personal?.address && (
                                <p className="flex items-center">
                                    <span className="w-2 h-2 bg-pink-300 rounded-full mr-2"></span>
                                    {personal.address}
                                </p>
                            )}
                            {personal?.linkedin && (
                                <p className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                                    LinkedIn
                                </p>
                            )}
                            {personal?.github && (
                                <p className="flex items-center">
                                    <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                                    GitHub
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    {skills?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                                <span className="mr-2">🎯</span> Skills
                            </h3>
                            <div className="space-y-2">
                                {skills.map((skill, idx) => (
                                    <div key={idx} className="bg-white/10 backdrop-blur rounded-lg px-3 py-2 text-sm">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3 p-8">
                    {/* Experience */}
                    {experience?.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-3 h-8 bg-gradient-to-b from-pink-500 to-indigo-500 rounded-full mr-3"></span>
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {experience.map((exp, idx) => (
                                    <div key={idx} className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="absolute -left-3 top-6 w-6 h-6 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full"></div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{exp.role}</h3>
                                                <p className="text-indigo-600 font-semibold">{exp.company}</p>
                                            </div>
                                            <span className="bg-gradient-to-r from-pink-100 to-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                                <span className="w-3 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></span>
                                Education
                            </h2>
                            <div className="space-y-4">
                                {education.map((edu, idx) => (
                                    <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{edu.school}</h3>
                                                <p className="text-green-600 font-semibold">{edu.degree}</p>
                                            </div>
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {edu.duration}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
