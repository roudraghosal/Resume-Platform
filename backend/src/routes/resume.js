import express from 'express';
import { createResume, getResumes, getResume, updateResume, deleteResume, downloadPDF } from '../controllers/resumeController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, createResume);
router.get('/', auth, getResumes);
router.get('/:id', auth, getResume);
router.put('/:id', auth, updateResume);
router.delete('/:id', auth, deleteResume);
router.get('/:id/pdf', auth, downloadPDF);

export default router;
