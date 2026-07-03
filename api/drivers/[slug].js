import { connectMongo } from '../../server/config/mongo.js';
import { Driver } from '../../server/models/Driver.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await connectMongo();
    const driver = await Driver.findOne({ slug: req.query.slug }).lean();

    if (!driver) {
      res.status(404).json({ error: 'Driver not found' });
      return;
    }

    res.status(200).json({ driver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
