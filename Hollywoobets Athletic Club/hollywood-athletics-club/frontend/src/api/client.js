import { API_ENDPOINTS } from './endpoints.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function getEndpoint(name, options = {}) {
  const endpoint = API_ENDPOINTS[name];

  if (!endpoint) {
    throw new Error(`Unknown API endpoint: ${name}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();

  if (!response.ok) {
    throw new Error(rawBody || `Request failed for ${endpoint}`);
  }

  if (!contentType.includes('application/json')) {
    throw new Error(
      `Expected JSON from ${endpoint}, received ${contentType || 'unknown content type'}. ` +
        'Check VITE_API_BASE_URL or the Vite /api proxy.',
    );
  }

  return rawBody ? JSON.parse(rawBody) : null;
}

export const getDashboardData = () => getEndpoint('dashboard');
export const getPerformanceData = () => getEndpoint('performance');
export const getProfileData = () => getEndpoint('profile');

export const syncStravaActivities = () =>
  getEndpoint('stravaSync', {
    method: 'POST',
    body: JSON.stringify({}),
  });

export const getStravaAuthUrl = () => getEndpoint('stravaAuthUrl');

export const getFutureEndpoint = getEndpoint;
