import { getLiveMarketplace } from '../services/marketplace.service.js';

export async function getMarketplace(req, res, next) {
  try {
    const result = await getLiveMarketplace();
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json(result);
  } catch (error) { next(error); }
}
