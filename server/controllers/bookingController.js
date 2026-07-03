import { Booking } from '../models/Booking.js';

function normalizeBooking(body) {
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

export async function createBooking(req, res, next) {
  try {
    const bookingInput = normalizeBooking(req.body);
    const validationError = validateBooking(bookingInput);

    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const booking = await Booking.create(bookingInput);
    res.status(201).json({ booking });
  } catch (error) {
    next(error);
  }
}

export async function listBookings(_req, res, next) {
  try {
    const bookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
}
