import { getLiveEvents } from '../services/events.service.js';

export async function getEvents(req, res, next) {
  try {
    const result = await getLiveEvents();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json(result);
  } catch (error) {
    next(error);
  }
}
