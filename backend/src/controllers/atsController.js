// ATS (Applicant Tracking System) Controller
export async function analyzeATS(req, res) {
    try {
        const { resume, jobDescription } = req.body;

        if (!resume) {
            return res.status(400).json({ message: 'Resume data is required' });
        }

        // Extract text content from resume
        const resumeText = extractResumeText(resume);
        const jobText = jobDescription || '';

        // Perform ATS analysis
        const analysis = performATSAnalysis(resumeText, jobText);

        res.json(analysis);
    } catch (error) {
        console.error('ATS analysis error:', error);
        res.status(500).json({ message: 'Failed to analyze resume' });
    }
}

export async function getATSRecommendations(req, res) {
    try {
        const { resumeId, jobDescription } = req.body;

        // Get resume from database
        const Resume = (await import('../models/Resume.js')).default;
        const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const latestVersion = resume.versions[resume.versions.length - 1];
        const resumeText = extractResumeText(latestVersion);

        const recommendations = generateATSRecommendations(resumeText, jobDescription);

        res.json({ recommendations });
    } catch (error) {
        console.error('ATS recommendations error:', error);
        res.status(500).json({ message: 'Failed to generate recommendations' });
    }
}

// Helper function to extract text from resume object
function extractResumeText(resume) {
    let text = '';

    // Personal information
    if (resume.personal) {
        text += `${resume.personal.name || ''} `;
        text += `${resume.personal.email || ''} `;
        text += `${resume.personal.phone || ''} `;
        text += `${resume.personal.address || ''} `;
        text += `${resume.personal.linkedin || ''} `;
        text += `${resume.personal.github || ''} `;
    }

    // Experience
    if (resume.experience) {
        resume.experience.forEach(exp => {
            text += `${exp.role || ''} `;
            text += `${exp.company || ''} `;
            text += `${exp.duration || ''} `;
            text += `${exp.description || ''} `;
        });
    }

    // Education
    if (resume.education) {
        resume.education.forEach(edu => {
            text += `${edu.degree || ''} `;
            text += `${edu.school || ''} `;
            text += `${edu.duration || ''} `;
        });
    }

    // Skills
    if (resume.skills) {
        text += resume.skills.join(' ');
    }

    return text.toLowerCase();
}

// Main ATS analysis function
function performATSAnalysis(resumeText, jobText) {
    const analysis = {
        score: 0,
        keywordMatch: 0,
        formatting: 0,
        sections: 0,
        readability: 0,
        strengths: [],
        improvements: []
    };

    // Keyword matching analysis
    if (jobText) {
        const keywordScore = analyzeKeywordMatch(resumeText, jobText);
        analysis.keywordMatch = keywordScore;

        if (keywordScore >= 70) {
            analysis.strengths.push('Strong keyword alignment with job description');
        } else if (keywordScore < 40) {
            analysis.improvements.push('Include more relevant keywords from job description');
        }
    } else {
        analysis.keywordMatch = 60; // Default if no job description
    }

    // Formatting analysis
    const formattingScore = analyzeFormatting(resumeText);
    analysis.formatting = formattingScore;

    if (formattingScore >= 80) {
        analysis.strengths.push('Clean, ATS-friendly formatting');
    } else {
        analysis.improvements.push('Improve formatting for better ATS compatibility');
    }

    // Section analysis
    const sectionScore = analyzeSections(resumeText);
    analysis.sections = sectionScore;

    if (sectionScore >= 80) {
        analysis.strengths.push('Contains all essential resume sections');
    } else {
        analysis.improvements.push('Add missing essential sections (Contact, Experience, Skills)');
    }

    // Readability analysis
    const readabilityScore = analyzeReadability(resumeText);
    analysis.readability = readabilityScore;

    if (readabilityScore >= 75) {
        analysis.strengths.push('Good readability and structure');
    } else {
        analysis.improvements.push('Improve content clarity and structure');
    }

    // Calculate overall score
    analysis.score = Math.round(
        (analysis.keywordMatch * 0.3) +
        (analysis.formatting * 0.25) +
        (analysis.sections * 0.25) +
        (analysis.readability * 0.2)
    );

    // Add general recommendations based on score
    if (analysis.score >= 80) {
        analysis.strengths.push('Excellent overall ATS compatibility');
    } else if (analysis.score >= 60) {
        analysis.improvements.push('Good foundation, minor improvements needed');
    } else {
        analysis.improvements.push('Significant improvements needed for ATS optimization');
    }

    return analysis;
}

// Analyze keyword matching between resume and job description
function analyzeKeywordMatch(resumeText, jobText) {
    if (!jobText) return 60;

    const jobKeywords = extractKeywords(jobText.toLowerCase());
    const resumeKeywords = extractKeywords(resumeText);

    let matches = 0;
    jobKeywords.forEach(keyword => {
        if (resumeKeywords.includes(keyword)) {
            matches++;
        }
    });

    return Math.min(100, Math.round((matches / Math.max(jobKeywords.length, 1)) * 100));
}

// Extract important keywords from text
function extractKeywords(text) {
    // Common technical skills and job-related keywords
    const keywords = [
        'javascript', 'python', 'java', 'react', 'node', 'sql', 'mongodb',
        'css', 'html', 'aws', 'docker', 'kubernetes', 'git', 'agile',
        'management', 'leadership', 'communication', 'teamwork', 'project',
        'analysis', 'development', 'design', 'testing', 'debugging'
    ];

    return keywords.filter(keyword => text.includes(keyword));
}

// Analyze formatting for ATS compatibility
function analyzeFormatting(resumeText) {
    let score = 70; // Base score

    // Check for good practices
    if (resumeText.length > 200) score += 10; // Sufficient content
    if (resumeText.length < 2000) score += 10; // Not too verbose

    // Check for common formatting issues (simplified)
    if (resumeText.includes('email')) score += 5; // Has contact info
    if (resumeText.includes('phone') || resumeText.includes('mobile')) score += 5;

    return Math.min(100, score);
}

// Analyze presence of essential resume sections
function analyzeSections(resumeText) {
    let score = 0;
    const sections = {
        contact: ['email', 'phone', 'mobile'],
        experience: ['experience', 'work', 'employment', 'position', 'role'],
        education: ['education', 'degree', 'university', 'college', 'school'],
        skills: ['skills', 'technologies', 'tools', 'programming']
    };

    Object.keys(sections).forEach(section => {
        const hasSection = sections[section].some(keyword =>
            resumeText.includes(keyword)
        );
        if (hasSection) score += 25;
    });

    return score;
}

// Analyze readability and structure
function analyzeReadability(resumeText) {
    let score = 60; // Base score

    // Word count analysis
    const wordCount = resumeText.split(' ').length;
    if (wordCount >= 100 && wordCount <= 800) score += 20;

    // Sentence structure (simplified)
    const sentences = resumeText.split('.').length;
    if (sentences > 10) score += 10;

    // Check for action verbs (simplified)
    const actionVerbs = ['managed', 'developed', 'created', 'implemented', 'designed', 'led', 'improved'];
    const hasActionVerbs = actionVerbs.some(verb => resumeText.includes(verb));
    if (hasActionVerbs) score += 10;

    return Math.min(100, score);
}

// Generate specific ATS recommendations
function generateATSRecommendations(resumeText, jobDescription) {
    const recommendations = [];

    // Keyword recommendations
    if (jobDescription) {
        const jobKeywords = extractKeywords(jobDescription.toLowerCase());
        const resumeKeywords = extractKeywords(resumeText);
        const missingKeywords = jobKeywords.filter(keyword => !resumeKeywords.includes(keyword));

        if (missingKeywords.length > 0) {
            recommendations.push({
                type: 'keywords',
                title: 'Add Missing Keywords',
                description: `Consider adding these relevant keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
                priority: 'high'
            });
        }
    }

    // Section recommendations
    if (!resumeText.includes('email')) {
        recommendations.push({
            type: 'contact',
            title: 'Add Contact Information',
            description: 'Include your email address for better ATS parsing',
            priority: 'high'
        });
    }

    // Formatting recommendations
    recommendations.push({
        type: 'formatting',
        title: 'Use Standard Section Headers',
        description: 'Use headers like "Experience", "Education", "Skills" for better ATS recognition',
        priority: 'medium'
    });

    recommendations.push({
        type: 'content',
        title: 'Include Quantifiable Achievements',
        description: 'Add numbers and metrics to demonstrate impact (e.g., "Increased sales by 25%")',
        priority: 'medium'
    });

    return recommendations;
}
