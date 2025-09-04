import express from 'express';
import { analyzeATS, getATSRecommendations } from '../controllers/atsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', authenticateToken, analyzeATS);
router.post('/recommendations', authenticateToken, getATSRecommendations);

export default router;
