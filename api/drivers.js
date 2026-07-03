import { connectMongo } from '../backend/config/mongo.js';
import { Driver } from '../backend/models/Driver.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await connectMongo();
    const drivers = await Driver.find({})
      .sort({ display_order: 1, name: 1 })
      .lean();

    res.status(200).json({ drivers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
