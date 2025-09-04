import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { PDFDocument } from 'pdf-lib';

export async function createResume(req, res) {
    try {
        const { personal, education, experience, skills, template } = req.body;
        const resume = await Resume.create({
            user: req.user.id,
            versions: [{ personal, education, experience, skills, template: template || 'modern' }]
        });
        await User.findByIdAndUpdate(req.user.id, { $push: { resumes: resume._id } });
        res.status(201).json(resume);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getResumes(req, res) {
    try {
        const resumes = await Resume.find({ user: req.user.id }).populate('user');
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getResume(req, res) {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updateResume(req, res) {
    try {
        const { personal, education, experience, skills, template } = req.body;
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        resume.versions.push({ personal, education, experience, skills, template: template || 'modern' });
        await resume.save();
        res.json(resume);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function deleteResume(req, res) {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        await User.findByIdAndUpdate(req.user.id, { $pull: { resumes: req.params.id } });
        res.json({ message: 'Resume deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function downloadPDF(req, res) {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        const latest = resume.versions[resume.versions.length - 1];

        // Create PDF with better formatting
        const doc = await PDFDocument.create();
        const page = doc.addPage([595, 842]); // A4 size
        let y = 800;

        // Helper function to add text
        const addText = (text, options = {}) => {
            if (y < 50) return; // Don't write below page margin
            page.drawText(text || '', { x: 50, y, size: 12, ...options });
            y -= options.lineHeight || 20;
        };

        // Header
        addText(latest.personal?.name || 'Resume', { size: 24, lineHeight: 30 });
        addText(`${latest.personal?.email || ''} | ${latest.personal?.phone || ''}`, { size: 12 });
        if (latest.personal?.address) addText(latest.personal.address);
        if (latest.personal?.linkedin) addText(`LinkedIn: ${latest.personal.linkedin}`);
        if (latest.personal?.github) addText(`GitHub: ${latest.personal.github}`);

        y -= 20; // Extra space

        // Education
        if (latest.education?.length > 0) {
            addText('EDUCATION', { size: 16, lineHeight: 25 });
            latest.education.forEach(ed => {
                addText(`${ed.school || ''} - ${ed.degree || ''} (${ed.duration || ''})`);
            });
            y -= 10;
        }

        // Experience
        if (latest.experience?.length > 0) {
            addText('EXPERIENCE', { size: 16, lineHeight: 25 });
            latest.experience.forEach(exp => {
                addText(`${exp.role || ''} at ${exp.company || ''} (${exp.duration || ''})`, { size: 14 });
                if (exp.description) {
                    // Word wrap description
                    const words = exp.description.split(' ');
                    let line = '';
                    words.forEach(word => {
                        if ((line + word).length > 80) {
                            addText(line, { x: 70, size: 10 });
                            line = word + ' ';
                        } else {
                            line += word + ' ';
                        }
                    });
                    if (line.trim()) addText(line, { x: 70, size: 10 });
                }
                y -= 5;
            });
        }

        // Skills
        if (latest.skills?.length > 0) {
            addText('SKILLS', { size: 16, lineHeight: 25 });
            addText(latest.skills.join(', '));
        }

        const pdfBytes = await doc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${latest.personal?.name || 'resume'}-resume.pdf"`);
        res.send(Buffer.from(pdfBytes));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
