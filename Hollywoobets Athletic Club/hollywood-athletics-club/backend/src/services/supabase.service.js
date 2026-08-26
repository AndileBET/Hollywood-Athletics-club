import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let supabaseClient;

export function getSupabase() {
  if (!env.supabase.url || !env.supabase.serviceRoleKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return supabaseClient;
}

export function requireSupabase() {
  const supabase = getSupabase();

  if (!supabase) {
    const error = new Error('Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to backend/.env.');
    error.statusCode = 503;
    throw error;
  }

  return supabase;
}

export function requireUserId(userId) {
  if (!userId) {
    const error = new Error('Missing userId. Pass userId in the request or set DEFAULT_USER_ID in backend/.env.');
    error.statusCode = 400;
    throw error;
  }
}

export function getDefaultUserId(req) {
  return req.query.userId || req.params.userId || req.body?.userId || env.defaultUserId;
}

export async function resolveUserId(req) {
  // 1. Always prefer the authenticated Hollywood Athletics user.
  // req.userId is set by auth.middleware.js after validating
  // the user's Supabase access token.
  if (req.userId) {
    return req.userId;
  }

  // 2. Temporary development fallback.
  // This keeps your existing DEFAULT_USER_ID setup working
  // while you transition to proper authentication.
  const explicitUserId = getDefaultUserId(req);

  if (explicitUserId) {
    return explicitUserId;
  }

  // 3. Final development fallback:
  // use the first profile in Supabase.
  const supabase = requireSupabase();

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.id) {
    const missingProfileError = new Error(
      'No authenticated user or profile could be resolved.'
    );

    missingProfileError.statusCode = 404;

    throw missingProfileError;
  }

  return data.id;
}

export async function getAthleteProfile(userId) {
  const supabase = requireSupabase();

  requireUserId(userId);

  console.log('PROFILE LOOKUP DEBUG:', {
    userId,
  });

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  console.log('PROFILE QUERY RESULT:', {
    requestedUserId: userId,
    found: Boolean(data),
    profileId: data?.id || null,
    profileEmail: data?.email || null,
    error: error?.message || null,
    errorCode: error?.code || null,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    const profileError = new Error(
      `No Hollywood Athletics profile exists for authenticated user ${userId}.`,
    );

    profileError.statusCode = 404;

    throw profileError;
  }

  return toUiAthlete(data);
}

export async function upsertAthleteProfile(profile) {
  const supabase = requireSupabase();
  requireUserId(profile.id);

  const { data, error } = await supabase
    .from('profiles')
    .upsert(toProfileRow(profile))
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return toUiAthlete(data);
}

export async function findUserByStravaAthleteId(stravaAthleteId) {
  if (!stravaAthleteId) {
    return null;
  }

  return null;
}

function toUiAthlete(row) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    memberSince: row.member_since
      ? new Intl.DateTimeFormat('en-ZA', { month: 'long', year: 'numeric' }).format(new Date(row.member_since))
      : '',
    location: '',
    stravaConnected: false,
    avatarInitials: initialsFromName(row.full_name),
    avatarUrl: row.avatar_url || '',
  };
}

function toProfileRow(profile) {
  return {
    id: profile.id,
    full_name: profile.full_name || profile.name,
    email: profile.email,
    avatar_url: profile.avatar_url || profile.avatarUrl || null,
    member_since: profile.member_since || profile.memberSince || new Date().toISOString().slice(0, 10),
  };
}

function initialsFromName(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
