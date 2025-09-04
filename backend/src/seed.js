import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Resume from './models/Resume.js';
dotenv.config();

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Resume.deleteMany();
    const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: '$2b$10$abcdefghijklmnopqrstuv' // bcrypt hash for 'password'
    });
    const resume = await Resume.create({
        user: user._id,
        versions: [{
            personal: {
                name: 'Test User',
                email: 'test@example.com',
                phone: '1234567890',
                address: '123 Main St',
                linkedin: 'linkedin.com/in/test',
                github: 'github.com/test'
            },
            education: [{ school: 'Test University', degree: 'BSc', duration: '2015-2019' }],
            experience: [{ company: 'TestCorp', role: 'Developer', description: 'Built stuff', duration: '2019-2021' }],
            skills: ['JavaScript', 'React', 'Node.js']
        }]
    });
    user.resumes.push(resume._id);
    await user.save();
    console.log('Seed data created');
    mongoose.disconnect();
}

seed();
