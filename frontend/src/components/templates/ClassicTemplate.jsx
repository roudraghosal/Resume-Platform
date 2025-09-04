import React from 'react';

export default function ClassicTemplate({ data }) {
    const { personal, education, experience, skills } = data;

    return (
        <div className="bg-white shadow-lg max-w-4xl mx-auto border">
            {/* Header */}
            <div className="border-b-4 border-gray-800 p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{personal?.name || 'Your Name'}</h1>
                <div className="flex justify-center items-center gap-6 text-gray-600">
                    {personal?.email && <span>{personal.email}</span>}
                    {personal?.phone && <span>•</span>}
                    {personal?.phone && <span>{personal.phone}</span>}
                    {personal?.address && <span>•</span>}
                    {personal?.address && <span>{personal.address}</span>}
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    {personal?.linkedin && (
                        <span className="text-blue-600">LinkedIn: {personal.linkedin}</span>
                    )}
                    {personal?.github && (
                        <span className="text-gray-700">GitHub: {personal.github}</span>
                    )}
                </div>
            </div>

            <div className="p-8">
                {/* Education */}
                {education?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                            Education
                        </h2>
                        {education.map((edu, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{edu.school}</h3>
                                        <p className="text-gray-600 italic">{edu.degree}</p>
                                    </div>
                                    <span className="text-gray-500 font-medium">{edu.duration}</span>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                            Professional Experience
                        </h2>
                        {experience.map((exp, idx) => (
                            <div key={idx} className="mb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{exp.role}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-gray-500 font-medium">{exp.duration}</span>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills */}
                {skills?.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide border-b border-gray-300 pb-2">
                            Technical Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="border border-gray-300 px-3 py-1 text-gray-700 text-sm"
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
