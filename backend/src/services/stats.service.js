import { calculateTotalPoints } from './points.service.js';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function buildDashboardStats(activities = []) {
  const totalPoints = calculateTotalPoints(activities);
  return {
    totalPoints,
    activitiesThisMonth: activities.filter((activity) => isCurrentMonth(activity.date)).length,
    weeklyStreak: calculateWeeklyStreak(activities),
    strideLevel: getTierName(totalPoints),
  };
}

export function buildProfileStats(activities = []) {
  const totalDistance = activities.reduce((sum, activity) => sum + Number(activity.distance || 0), 0);
  return { totalDistance: `${totalDistance.toFixed(1)} km`, totalPoints: calculateTotalPoints(activities), totalActivities: activities.length, currentStreak: calculateCurrentStreak(activities) };
}

export function buildPerformanceStats(activities = []) {
  return { monthlyDistanceData: buildMonthlyDistanceData(activities), totalMinutesData: buildTotalMinutesData(activities), activityCountData: buildActivityCountData(activities) };
}

export function calculateWeeklyStreak(activities = []) {
  const weeks = [
    ...new Set(
      activities
        .map((activity) => getWeekKey(activity.date))
        .filter(Boolean)
    ),
  ].sort().reverse();

  if (!weeks.length) return 0;

  const currentWeek = getWeekKey(new Date());

  // The streak must include the current week or the immediately
  // previous week. Otherwise the streak has gone inactive.
  if (weeks[0] !== currentWeek) {
    const previousWeek = getPreviousWeekKey(currentWeek);

    if (weeks[0] !== previousWeek) {
      return 0;
    }
  }

  let streak = 1;

  for (let i = 1; i < weeks.length; i += 1) {
    const expectedPreviousWeek = getPreviousWeekKey(weeks[i - 1]);

    if (weeks[i] !== expectedPreviousWeek) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function getWeekKey(value) {
  const date = parseDate(value);

  if (!date) return '';

  // Monday-based weeks: Monday -> Sunday
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const day = localDate.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  localDate.setDate(localDate.getDate() - daysFromMonday);

  return [
    localDate.getFullYear(),
    String(localDate.getMonth() + 1).padStart(2, '0'),
    String(localDate.getDate()).padStart(2, '0'),
  ].join('-');
}

function getPreviousWeekKey(weekKey) {
  const date = new Date(`${weekKey}T00:00:00`);
  date.setDate(date.getDate() - 7);
  return getWeekKey(date);
}

function buildMonthlyDistanceData(activities) {
  return Object.entries(groupByMonth(activities)).map(([month, rows]) => ({ month, distance: Number(rows.reduce((total, activity) => total + Number(activity.distance || 0), 0).toFixed(1)) }));
}

function buildTotalMinutesData(activities) {
  return Object.entries(groupByMonth(activities)).map(([month, rows]) => ({ month, minutes: Math.round(rows.reduce((total, activity) => total + durationToMinutes(activity.duration), 0)) }));
}

function buildActivityCountData(activities) {
  return Object.entries(groupByMonth(activities)).map(([month, rows]) => ({ month, count: rows.length }));
}

function groupByMonth(activities) {
  const ordered = [...activities].sort((a, b) => activityTimestamp(a) - activityTimestamp(b));
  const grouped = {};
  ordered.forEach((activity) => {
    const date = parseDate(activity.date);
    const key = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : '9999-99';
    const label = date ? monthLabels[date.getMonth()] : 'Now';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(activity);
    grouped[key].label = label;
  });
  return Object.fromEntries(Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([, rows]) => [rows.label, rows.filter(Boolean)]));
}

function durationToMinutes(value = '') {
  const parts = String(value).split(':').map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return 0;
}

function activityTimestamp(activity) {
  const value = activity.startDate || activity.date;
  const date = parseDate(value);
  return date ? date.getTime() : 0;
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isCurrentMonth(value) {
  const date = parseDate(value);
  if (!date) return false;
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function calculateCurrentStreak(activities = []) {
  const dates = [...new Set(activities.map((activity) => toDateKey(activity.date)).filter(Boolean))].sort().reverse();
  if (!dates.length) return 0;
  const latest = new Date(`${dates[0]}T00:00:00`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysBehind = Math.round((today - latest) / 86400000);
  if (daysBehind > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i += 1) {
    const current = new Date(`${dates[i - 1]}T00:00:00`);
    const previous = new Date(`${dates[i]}T00:00:00`);
    if (Math.round((current - previous) / 86400000) !== 1) break;
    streak += 1;
  }
  return streak;
}

function toDateKey(value) {
  const date = parseDate(value);
  if (!date) return '';
  return date.toISOString().slice(0, 10);
}

function getTierName(points) {
  if (points >= 8000) return 'Champion';
  if (points >= 5000) return 'Performer';
  if (points >= 2000) return 'Mover';
  return 'Starter';
}
