import { connectMongo } from '../server/config/mongo.js';
import { Feedback } from '../server/models/Feedback.js';

function normalizeFeedback(body = {}) {
  return {
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim(),
    related_driver: String(body.related_driver || '').trim(),
    message: String(body.message || '').trim()
  };
}

function validateFeedback(input) {
  if (input.name.length < 2) return 'Name must be at least 2 characters.';
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return 'Email is not valid.';
  if (input.message.length < 8) return 'Suggestion must be at least 8 characters.';
  return '';
}

export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method === 'GET') {
      const feedback = await Feedback.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      res.status(200).json({ feedback });
      return;
    }

    if (req.method === 'POST') {
      const feedbackInput = normalizeFeedback(req.body);
      const validationError = validateFeedback(feedbackInput);

      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const feedback = await Feedback.create(feedbackInput);
      res.status(201).json({ feedback });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
