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

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed for ${endpoint}`);
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const body = await response.text();
    throw new Error(
      `Expected JSON from ${endpoint}, but received ${contentType || 'unknown content type'}. ` +
      `This usually means the frontend is hitting the wrong server. Response starts with: ${body.slice(0, 80)}`,
    );
  }

  return response.json();
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
