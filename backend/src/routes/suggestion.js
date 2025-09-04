import express from 'express';
import { suggestSkills } from '../controllers/suggestionController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, suggestSkills);

export default router;
