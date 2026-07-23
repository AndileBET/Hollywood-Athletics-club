import axios from 'axios';
import { env } from '../config/env.js';
import { requireSupabase, requireUserId } from './supabase.service.js';

const STRAVA_API_BASE_URL = 'https://www.strava.com/api/v3';
const STRAVA_OAUTH_BASE_URL = 'https://www.strava.com/oauth';
const REFRESH_WINDOW_SECONDS = 300;

export function getStravaAuthorizationUrl(state = '') {
  requireStravaConfig();

  const params = new URLSearchParams({
    client_id: env.strava.clientId,
    redirect_uri: env.strava.redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read_all',
  });

  if (state) {
    params.set('state', state);
  }

  return `${STRAVA_OAUTH_BASE_URL}/authorize?${params.toString()}`;
}

export async function exchangeStravaCode(code) {
  requireStravaConfig();

  const { data } = await axios.post(`${STRAVA_OAUTH_BASE_URL}/token`, {
    client_id: env.strava.clientId,
    client_secret: env.strava.clientSecret,
    code,
    grant_type: 'authorization_code',
  });

  return data;
}

export async function refreshStravaAccessToken(refreshToken) {
  requireStravaConfig();

  const { data } = await axios.post(`${STRAVA_OAUTH_BASE_URL}/token`, {
    client_id: env.strava.clientId,
    client_secret: env.strava.clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  return data;
}

export async function listStravaActivities(accessToken, options = {}) {
  const params = {
    per_page: options.perPage || 30,
    page: options.page || 1,
  };

  if (options.after) {
    params.after = options.after;
  }

  const { data } = await axios.get(`${STRAVA_API_BASE_URL}/athlete/activities`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params,
  });

  return data;
}

export async function saveStravaTokens(userId, tokenPayload) {
  const supabase = requireSupabase();
  requireUserId(userId);

  const { data, error } = await supabase
    .from('strava_connections')
    .upsert({
      user_id: userId,
      strava_athlete_id: tokenPayload.athlete?.id,
      strava_access_token: tokenPayload.access_token,
      strava_refresh_token: tokenPayload.refresh_token,
      strava_token_expires_at: new Date(tokenPayload.expires_at * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    if (isMissingTableError(error)) {
      const missingConnectionTableError = new Error('Strava is configured, but public.strava_connections does not exist yet.');
      missingConnectionTableError.statusCode = 503;
      throw missingConnectionTableError;
    }
    throw error;
  }

  return data;
}

export async function getValidStravaAccessToken(userId) {
  const supabase = requireSupabase();
  requireUserId(userId);

  const { data: user, error } = await supabase
    .from('strava_connections')
    .select('strava_access_token, strava_refresh_token, strava_token_expires_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return null;
    }
    throw error;
  }

  if (!user?.strava_refresh_token) {
    return null;
  }

  const expiresAtSeconds = Math.floor(new Date(user.strava_token_expires_at).getTime() / 1000);
  const shouldRefresh = expiresAtSeconds - Math.floor(Date.now() / 1000) < REFRESH_WINDOW_SECONDS;

  if (!shouldRefresh) {
    return user.strava_access_token;
  }

  const refreshed = await refreshStravaAccessToken(user.strava_refresh_token);
  await saveStravaTokens(userId, refreshed);

  return refreshed.access_token;
}

export async function hasStravaConnection(userId) {
  const supabase = requireSupabase();
  requireUserId(userId);

  const { data, error } = await supabase
    .from('strava_connections')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return false;
    }
    throw error;
  }

  return Boolean(data);
}

function isMissingTableError(error) {
  return error?.code === '42P01';
}

function requireStravaConfig() {
  const isConfigured = Boolean(
    env.strava.clientId &&
      env.strava.clientSecret &&
      env.strava.redirectUri,
  );

  if (!isConfigured) {
    const error = new Error('Strava is not configured. Add STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REDIRECT_URI to backend/.env.');
    error.statusCode = 503;
    throw error;
  }
}
