// Auto-Fill Controller for job applications
export async function extractResumeData(req, res) {
    try {
        const { resumeData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ message: 'Resume data is required' });
        }

        // Extract structured data from resume
        const extractedData = {
            personal: extractPersonalInfo(resumeData),
            professional: extractProfessionalInfo(resumeData),
            technical: extractTechnicalInfo(resumeData)
        };

        // Define common job application fields that can be auto-filled
        const commonFields = [
            'firstName', 'lastName', 'email', 'phone', 'address',
            'linkedin', 'github', 'summary', 'experience', 'education', 'skills'
        ];

        res.json({
            extractedData,
            commonFields,
            message: 'Resume data extracted successfully'
        });
    } catch (error) {
        console.error('Extract resume data error:', error);
        res.status(500).json({ message: 'Failed to extract resume data' });
    }
}

export async function generateAutoFillData(req, res) {
    try {
        const { resumeData, jobData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ message: 'Resume data is required' });
        }

        // Generate auto-fill data optimized for the specific job
        const autoFillData = {
            // Basic Information
            firstName: extractFirstName(resumeData.personal?.name),
            lastName: extractLastName(resumeData.personal?.name),
            email: resumeData.personal?.email || '',
            phone: resumeData.personal?.phone || '',
            address: resumeData.personal?.address || '',
            linkedin: resumeData.personal?.linkedin || '',
            github: resumeData.personal?.github || '',
            portfolio: resumeData.personal?.portfolio || resumeData.personal?.website || '',

            // Professional Information
            summary: generateProfessionalSummary(resumeData, jobData),
            experience: formatExperienceForApplication(resumeData.experience, jobData),
            education: formatEducationForApplication(resumeData.education),
            skills: formatSkillsForApplication(resumeData.skills, jobData),

            // Application-specific fields
            coverLetter: generateCoverLetter(resumeData, jobData),
            whyThisCompany: generateWhyThisCompany(jobData),
            relevantExperience: extractRelevantExperience(resumeData.experience, jobData),
            achievements: extractAchievements(resumeData.experience),

            // Additional fields
            expectedSalary: '',
            availableStartDate: generateAvailableStartDate(),
            relocateWillingness: 'Open to discussion',
            workAuthorization: 'Authorized to work',
            references: 'Available upon request'
        };

        // Track application for analytics
        await trackJobApplication(req.user.id, jobData, autoFillData);

        res.json({
            autoFillData,
            jobData,
            message: 'Auto-fill data generated successfully'
        });
    } catch (error) {
        console.error('Generate auto-fill data error:', error);
        res.status(500).json({ message: 'Failed to generate auto-fill data' });
    }
}

export async function saveJobApplication(req, res) {
    try {
        const { jobData, autoFillData, applicationStatus } = req.body;

        // Save job application to database (you can expand this based on your needs)
        const JobApplication = (await import('../models/JobApplication.js')).default;

        const application = await JobApplication.create({
            user: req.user.id,
            company: jobData.company,
            position: jobData.position,
            jobUrl: jobData.jobUrl,
            autoFillData,
            applicationStatus: applicationStatus || 'pending',
            appliedAt: new Date()
        });

        res.json({
            application,
            message: 'Job application saved successfully'
        });
    } catch (error) {
        console.error('Save job application error:', error);
        res.status(500).json({ message: 'Failed to save job application' });
    }
}

// Get user's job applications
export async function getUserApplications(req, res) {
    try {
        const JobApplication = (await import('../models/JobApplication.js')).default;
        const applications = await JobApplication.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch job applications'
        });
    }
}

// Update job application status
export async function updateApplicationStatus(req, res) {
    try {
        const { id } = req.params;
        const { applicationStatus } = req.body;
        const JobApplication = (await import('../models/JobApplication.js')).default;

        const application = await JobApplication.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { applicationStatus },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Job application not found'
            });
        }

        res.json({
            success: true,
            message: 'Application status updated successfully',
            application
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application status'
        });
    }
}

// Delete job application
export async function deleteApplication(req, res) {
    try {
        const { id } = req.params;
        const JobApplication = (await import('../models/JobApplication.js')).default;

        const application = await JobApplication.findOneAndDelete({ _id: id, user: req.user.id });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Job application not found'
            });
        }

        res.json({
            success: true,
            message: 'Job application deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting job application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete job application'
        });
    }
}

// Helper Functions

function extractPersonalInfo(resumeData) {
    return {
        name: resumeData.personal?.name || '',
        email: resumeData.personal?.email || '',
        phone: resumeData.personal?.phone || '',
        address: resumeData.personal?.address || '',
        linkedin: resumeData.personal?.linkedin || '',
        github: resumeData.personal?.github || ''
    };
}

function extractProfessionalInfo(resumeData) {
    return {
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || []
    };
}

function extractTechnicalInfo(resumeData) {
    const technicalSkills = resumeData.skills?.filter(skill =>
        ['javascript', 'python', 'java', 'react', 'node', 'sql', 'mongodb', 'aws']
            .some(tech => skill.toLowerCase().includes(tech))
    ) || [];

    return {
        programmingLanguages: technicalSkills,
        frameworks: extractFrameworks(resumeData.skills),
        databases: extractDatabases(resumeData.skills),
        tools: extractTools(resumeData.skills)
    };
}

function extractFirstName(fullName) {
    if (!fullName) return '';
    return fullName.split(' ')[0] || '';
}

function extractLastName(fullName) {
    if (!fullName) return '';
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
}

function generateProfessionalSummary(resumeData, jobData) {
    const experience = resumeData.experience || [];
    const skills = resumeData.skills || [];
    const totalYears = calculateTotalExperience(experience);

    let summary = '';

    if (totalYears > 0) {
        summary += `Experienced professional with ${totalYears}+ years in `;
    } else {
        summary += `Motivated professional specializing in `;
    }

    // Add relevant skills based on job
    if (jobData?.position) {
        summary += `${jobData.position.toLowerCase()} and related technologies. `;
    } else {
        summary += `software development and technology solutions. `;
    }

    // Add key skills
    if (skills.length > 0) {
        const topSkills = skills.slice(0, 5).join(', ');
        summary += `Proficient in ${topSkills}. `;
    }

    // Add a closing statement
    summary += `Passionate about delivering high-quality solutions and contributing to team success.`;

    return summary;
}

function formatExperienceForApplication(experience, jobData) {
    if (!experience || experience.length === 0) return '';

    return experience.map(exp => {
        let formatted = `${exp.role || 'Position'} at ${exp.company || 'Company'}`;
        if (exp.duration) formatted += ` (${exp.duration})`;
        if (exp.description) formatted += `\n${exp.description}`;
        return formatted;
    }).join('\n\n');
}

function formatEducationForApplication(education) {
    if (!education || education.length === 0) return '';

    return education.map(edu => {
        let formatted = `${edu.degree || 'Degree'} from ${edu.school || 'Institution'}`;
        if (edu.duration) formatted += ` (${edu.duration})`;
        return formatted;
    }).join('\n');
}

function formatSkillsForApplication(skills, jobData) {
    if (!skills || skills.length === 0) return '';

    // Prioritize skills relevant to the job
    let prioritizedSkills = [...skills];

    if (jobData?.position) {
        const jobTitle = jobData.position.toLowerCase();
        prioritizedSkills.sort((a, b) => {
            const aRelevant = a.toLowerCase().includes(jobTitle) ||
                jobTitle.includes(a.toLowerCase());
            const bRelevant = b.toLowerCase().includes(jobTitle) ||
                jobTitle.includes(b.toLowerCase());

            if (aRelevant && !bRelevant) return -1;
            if (!aRelevant && bRelevant) return 1;
            return 0;
        });
    }

    return prioritizedSkills.join(', ');
}

function generateCoverLetter(resumeData, jobData) {
    const companyName = jobData?.company || '[Company Name]';
    const position = jobData?.position || '[Position Title]';
    const name = resumeData.personal?.name || '[Your Name]';

    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${position} position at ${companyName}. With my background in software development and proven track record of delivering high-quality solutions, I am excited about the opportunity to contribute to your team.

In my previous roles, I have developed expertise in various technologies and have consistently delivered projects that exceed expectations. My technical skills, combined with my passion for innovation and problem-solving, make me well-suited for this position.

I am particularly drawn to ${companyName} because of its reputation for excellence and innovation in the industry. I believe my skills and enthusiasm would be valuable additions to your team.

Thank you for considering my application. I look forward to discussing how I can contribute to ${companyName}'s continued success.

Best regards,
${name}`;
}

function generateWhyThisCompany(jobData) {
    const companyName = jobData?.company || '[Company Name]';

    return `I am particularly interested in ${companyName} because of its innovative approach to technology and its reputation as an industry leader. The company's commitment to excellence and growth opportunities align perfectly with my career goals and values.`;
}

function extractRelevantExperience(experience, jobData) {
    if (!experience || experience.length === 0) return '';

    // For now, return the most recent experience
    // This could be enhanced with keyword matching
    const mostRecent = experience[0];
    if (mostRecent) {
        return `${mostRecent.role} at ${mostRecent.company} - ${mostRecent.description || 'Relevant experience in the field'}`;
    }

    return '';
}

function extractAchievements(experience) {
    if (!experience || experience.length === 0) return '';

    const achievements = experience
        .filter(exp => exp.description)
        .map(exp => exp.description)
        .filter(desc => desc.includes('%') || desc.includes('increased') || desc.includes('improved'))
        .join('\n');

    return achievements || 'Consistently delivered high-quality work and exceeded performance expectations.';
}

function generateAvailableStartDate() {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 2 weeks from now
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

function calculateTotalExperience(experience) {
    // Simple calculation - could be enhanced
    return experience?.length * 2 || 0; // Assume 2 years per position on average
}

function extractFrameworks(skills) {
    const frameworks = ['react', 'angular', 'vue', 'express', 'django', 'flask', 'spring'];
    return skills?.filter(skill =>
        frameworks.some(framework => skill.toLowerCase().includes(framework))
    ) || [];
}

function extractDatabases(skills) {
    const databases = ['mongodb', 'mysql', 'postgresql', 'redis', 'sql'];
    return skills?.filter(skill =>
        databases.some(db => skill.toLowerCase().includes(db))
    ) || [];
}

function extractTools(skills) {
    const tools = ['git', 'docker', 'kubernetes', 'aws', 'jenkins', 'jira'];
    return skills?.filter(skill =>
        tools.some(tool => skill.toLowerCase().includes(tool))
    ) || [];
}

async function trackJobApplication(userId, jobData, autoFillData) {
    try {
        // This could be expanded to track analytics
        console.log(`User ${userId} generated auto-fill data for ${jobData?.company} - ${jobData?.position}`);
    } catch (error) {
        console.error('Error tracking job application:', error);
    }
}
