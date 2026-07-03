import { Router } from 'express';
import { createFeedback, listFeedback } from '../controllers/feedbackController.js';

export const feedbackRoutes = Router();

feedbackRoutes.get('/', listFeedback);
feedbackRoutes.post('/', createFeedback);
