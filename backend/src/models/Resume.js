import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
    personal: {
        name: String,
        email: String,
        phone: String,
        address: String,
        linkedin: String,
        github: String
    },
    education: [{
        school: String,
        degree: String,
        duration: String
    }],
    experience: [{
        company: String,
        role: String,
        description: String,
        duration: String
    }],
    skills: [String],
    template: { type: String, default: 'modern' },
    createdAt: { type: Date, default: Date.now }
});

const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    versions: [versionSchema]
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
