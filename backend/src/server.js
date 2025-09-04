import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import suggestionRoutes from './routes/suggestion.js';
import atsRoutes from './routes/ats.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/suggestion', suggestionRoutes);
app.use('/api/ats', atsRoutes);

const PORT = process.env.PORT || 5000;

// Use in-memory MongoDB for local development
async function startServer() {
    try {
        let mongoUri = process.env.MONGO_URI;

        // If MongoDB connection fails, use in-memory server
        if (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
            console.log('Starting in-memory MongoDB for local development...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            console.log('In-memory MongoDB started at:', mongoUri);
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Server startup error:', err);
    }
}

startServer();
