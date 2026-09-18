import { API_ENDPOINTS } from './endpoints.js';
import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function getEndpoint(name, options = {}) {
  const endpoint = API_ENDPOINTS[name];
  if (!endpoint) throw new Error(`Unknown API endpoint: ${name}`);
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    cache: name === 'marketplace' || name === 'bookings' ? 'no-store' : (options.cache || 'default'),
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();
  let payload = null;
  try { payload = rawBody ? JSON.parse(rawBody) : null; } catch { payload = rawBody; }
  if (!response.ok) throw new Error(payload?.error || payload?.message || (typeof payload === 'string' ? payload : `Request failed for ${endpoint}`));
  if (rawBody && !contentType.includes('application/json')) throw new Error(`Expected JSON from ${endpoint}.`);
  return payload;
}

export const getDashboardData = () => getEndpoint('dashboard');
export const getPerformanceData = () => getEndpoint('performance');
export const getProfileData = () => getEndpoint('profile');
export const saveProfile = (body) => getEndpoint('saveProfile', { method: 'POST', body: JSON.stringify(body) });
export const getRewards = () => getEndpoint('rewards');
export const getLeaderboard = () => getEndpoint('leaderboard');
export const getCommunityMessages = () => getEndpoint('communityMessages');
export const postCommunityMessage = (message) => getEndpoint('communityMessages', { method: 'POST', body: JSON.stringify({ message }) });
export const getMarketplaceData = () => getEndpoint('marketplace');

export const getBookingsData = () => getEndpoint('bookings');
export const syncStravaActivities = () => getEndpoint('stravaSync', { method: 'POST', body: JSON.stringify({ perPage: 100 }) });
export const getStravaAuthUrl = () => getEndpoint('stravaAuthUrl');
