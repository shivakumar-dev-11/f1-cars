import { Router } from 'express';
import { createBooking, listBookings } from '../controllers/bookingController.js';

export const bookingRoutes = Router();

bookingRoutes.get('/', listBookings);
bookingRoutes.post('/', createBooking);
