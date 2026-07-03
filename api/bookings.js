import { connectMongo } from '../backend/config/mongo.js';
import { Booking } from '../backend/models/Booking.js';

function normalizeBooking(body = {}) {
  return {
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim(),
    affiliation: String(body.affiliation || '').trim()
  };
}

function validateBooking(input) {
  if (input.name.length < 2) return 'Name must be at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return 'Email is not valid.';
  return '';
}

export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method === 'GET') {
      const bookings = await Booking.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      res.status(200).json({ bookings });
      return;
    }

    if (req.method === 'POST') {
      const bookingInput = normalizeBooking(req.body);
      const validationError = validateBooking(bookingInput);

      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const booking = await Booking.create(bookingInput);
      res.status(201).json({ booking });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
