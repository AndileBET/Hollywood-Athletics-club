import { getLiveBookings } from '../services/bookings.service.js';

export async function getBookings(req, res, next) {
  try {
    const result = await getLiveBookings();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json(result);
  } catch (error) {
    next(error);
  }
}
