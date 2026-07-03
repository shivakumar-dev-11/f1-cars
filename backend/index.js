import express from 'express';
import { connectMongo } from './config/mongo.js';
import { env } from './config/env.js';
import { bookingRoutes } from './routes/bookingRoutes.js';
import { driverRoutes } from './routes/driverRoutes.js';
import { feedbackRoutes } from './routes/feedbackRoutes.js';

const app = express();

app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: 'mongodb' });
});

app.use('/api/drivers', driverRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error.' });
});

try {
  await connectMongo();
  app.listen(env.port, '127.0.0.1', () => {
    console.log(`APEX API connected to MongoDB and listening at http://127.0.0.1:${env.port}`);
  });
} catch (error) {
  console.error('Failed to start APEX API:', error.message);
  process.exit(1);
}
