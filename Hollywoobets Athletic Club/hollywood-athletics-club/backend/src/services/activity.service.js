import { calculateActivityPoints } from './points.service.js';
import { requireSupabase, requireUserId } from './supabase.service.js';

export function secondsToDuration(totalSeconds = 0) {
  const seconds = Math.max(Number(totalSeconds || 0), 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function secondsToPace(secondsPerKm) {
  if (!secondsPerKm) {
    return '-';
  }

  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);

  return `${minutes}:${String(seconds).padStart(2, '0')}/km`;
}

export function normalizeStravaActivity(activity, userId) {
  const activityName = activity.name || 'Strava Activity';
  const distanceKm = Number(((activity.distance || 0) / 1000).toFixed(2));
  const movingTime = Number(activity.moving_time || activity.elapsed_time || 0);
  const paceSecondsPerKm = distanceKm > 0 ? Number((movingTime / distanceKm).toFixed(2)) : null;
  const startDate = activity.start_date || null;
  const points = calculateActivityPoints(distanceKm);

  return {
    user_id: userId,
    strava_activity_id: activity.id,
    activity_name: activityName,
    activity_date: startDate ? startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    name: activityName,
    sport_type: activity.sport_type || activity.type || 'Run',
    activity_type: activity.type || activity.sport_type || 'Run',
    distance_km: distanceKm,
    duration: secondsToDuration(movingTime),
    pace: secondsToPace(paceSecondsPerKm),
    elevation_metres: Number(activity.total_elevation_gain || 0),
    points_earned: points,
    moving_time_seconds: movingTime,
    elapsed_time_seconds: Number(activity.elapsed_time || movingTime),
    pace_seconds_per_km: paceSecondsPerKm,
    total_elevation_gain: Number(activity.total_elevation_gain || 0),
    start_date: startDate,
    points,
    raw_payload: activity,
  };
}

export async function listActivities(userId) {
  const supabase = requireSupabase();
  requireUserId(userId);

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) {
    if (isMissingTableError(error)) {
      return [];
    }
    throw error;
  }

  return data.map(toUiActivity);
}

export async function upsertActivities(userId, stravaActivities) {
  const supabase = requireSupabase();
  requireUserId(userId);

  const rows = stravaActivities.map((activity) => normalizeStravaActivity(activity, userId));

  if (rows.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('activities')
    .upsert(rows, { onConflict: 'strava_activity_id' })
    .select('*');

  if (error) {
    if (isMissingTableError(error)) {
      return [];
    }
    throw error;
  }

  return data.map(toUiActivity);
}

function toUiActivity(row) {
  const distance = Number(row.distance_km || 0);

  return {
    id: row.id || row.strava_activity_id,
    name: row.name || row.activity_name || 'Activity',
    date: row.start_date ? formatActivityDate(row.start_date) : row.activity_date ? formatActivityDate(row.activity_date) : '',
    distance,
    duration: row.moving_time_seconds ? secondsToDuration(row.moving_time_seconds) : row.duration || secondsToDuration(0),
    pace: row.pace_seconds_per_km ? secondsToPace(row.pace_seconds_per_km) : row.pace || '-',
    elevation: `${Math.round(Number(row.total_elevation_gain ?? row.elevation_metres ?? 0))} m`,
    points: row.points || row.points_earned || calculateActivityPoints(distance),
    type: row.activity_type || row.sport_type || 'Run',
  };
}

function formatActivityDate(value) {
  return new Intl.DateTimeFormat('en-ZA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function isMissingTableError(error) {
  return error?.code === '42P01';
}
