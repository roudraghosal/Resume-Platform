import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    jobUrl: {
        type: String
    },
    autoFillData: {
        type: Object,
        default: {}
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'applied', 'interview', 'rejected', 'accepted'],
        default: 'pending'
    },
    notes: {
        type: String
    },
    appliedAt: {
        type: Date
    },
    followUpDate: {
        type: Date
    },
    interviewDate: {
        type: Date
    },
    salary: {
        offered: Number,
        expected: Number,
        negotiated: Number
    },
    applicationMethod: {
        type: String,
        enum: ['website', 'email', 'linkedin', 'referral', 'recruiter', 'other'],
        default: 'website'
    },
    contacts: [{
        name: String,
        email: String,
        phone: String,
        role: String,
        notes: String
    }],
    documents: [{
        type: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now }
    }],
    timeline: [{
        event: String,
        date: { type: Date, default: Date.now },
        notes: String
    }]
}, {
    timestamps: true
});

// Add indexes for better query performance
jobApplicationSchema.index({ user: 1, appliedAt: -1 });
jobApplicationSchema.index({ user: 1, applicationStatus: 1 });
jobApplicationSchema.index({ company: 1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
