import { connectMongo } from '../backend/config/mongo.js';

export default async function handler(_req, res) {
  try {
    await connectMongo();
    res.status(200).json({ ok: true, database: 'mongodb' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
