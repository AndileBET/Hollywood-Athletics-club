import { API_ENDPOINTS } from './endpoints.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function getFutureEndpoint(name) {
  const endpoint = API_ENDPOINTS[name];

  if (!endpoint) {
    throw new Error(`Unknown API endpoint: ${name}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Request failed for ${endpoint}`);
  }

  return response.json();
}
