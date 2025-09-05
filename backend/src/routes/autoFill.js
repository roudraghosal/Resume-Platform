import express from 'express';
import { 
  extractResumeData, 
  generateAutoFillData, 
  saveJobApplication,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication
} from '../controllers/autoFillController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/extract', authenticateToken, extractResumeData);
router.post('/generate', authenticateToken, generateAutoFillData);
router.post('/save-application', authenticateToken, saveJobApplication);
router.get('/applications', authenticateToken, getUserApplications);
router.patch('/applications/:id', authenticateToken, updateApplicationStatus);
router.delete('/applications/:id', authenticateToken, deleteApplication);

export default router;
