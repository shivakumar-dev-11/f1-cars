import { Feedback } from '../models/Feedback.js';

function normalizeFeedback(body) {
  return {
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim(),
    related_driver: String(body.related_driver || '').trim(),
    message: String(body.message || '').trim()
  };
}

export async function createFeedback(req, res, next) {
  try {
    const feedbackInput = normalizeFeedback(req.body);

    if (feedbackInput.name.length < 2) {
      res.status(400).json({ error: 'Name must be at least 2 characters.' });
      return;
    }

    if (feedbackInput.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackInput.email)) {
      res.status(400).json({ error: 'Email is not valid.' });
      return;
    }

    if (feedbackInput.message.length < 8) {
      res.status(400).json({ error: 'Suggestion must be at least 8 characters.' });
      return;
    }

    const feedback = await Feedback.create(feedbackInput);
    res.status(201).json({ feedback });
  } catch (error) {
    next(error);
  }
}

export async function listFeedback(_req, res, next) {
  try {
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ feedback });
  } catch (error) {
    next(error);
  }
}
