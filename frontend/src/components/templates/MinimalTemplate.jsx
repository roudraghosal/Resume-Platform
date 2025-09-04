import React from 'react';

export default function MinimalTemplate({ data }) {
    const { personal, education, experience, skills } = data;

    return (
        <div className="bg-white max-w-4xl mx-auto p-12 font-light">
            {/* Header */}
            <header className="text-center mb-16">
                <h1 className="text-5xl font-thin text-gray-900 mb-4 tracking-wide">
                    {personal?.name || 'Your Name'}
                </h1>
                <div className="flex justify-center items-center gap-8 text-gray-600 text-sm">
                    {personal?.email && <span>{personal.email}</span>}
                    {personal?.phone && <span>{personal.phone}</span>}
                    {personal?.linkedin && <span>LinkedIn</span>}
                    {personal?.github && <span>GitHub</span>}
                </div>
                <div className="mt-4 w-16 h-px bg-gray-400 mx-auto"></div>
            </header>

            {/* Experience */}
            {experience?.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-8 text-center">
                        Experience
                    </h2>
                    <div className="space-y-12">
                        {experience.map((exp, idx) => (
                            <div key={idx} className="text-center">
                                <h3 className="text-xl font-normal text-gray-900 mb-1">{exp.role}</h3>
                                <p className="text-gray-600 mb-2">{exp.company}</p>
                                <p className="text-sm text-gray-500 mb-4">{exp.duration}</p>
                                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-8 text-center">
                        Education
                    </h2>
                    <div className="space-y-8">
                        {education.map((edu, idx) => (
                            <div key={idx} className="text-center">
                                <h3 className="text-lg font-normal text-gray-900">{edu.school}</h3>
                                <p className="text-gray-600">{edu.degree}</p>
                                <p className="text-sm text-gray-500">{edu.duration}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
                <section>
                    <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-8 text-center">
                        Skills
                    </h2>
                    <div className="text-center">
                        <p className="text-gray-700 leading-relaxed">
                            {skills.join(' • ')}
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}
