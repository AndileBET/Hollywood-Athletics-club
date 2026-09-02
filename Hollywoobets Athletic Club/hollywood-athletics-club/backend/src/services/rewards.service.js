import { calculateTotalPoints } from './points.service.js';

const achievementDefinitions = [
  {
    id: 'first-activity',
    title: 'First Step',
    description: 'Complete your first synced activity',
    points: 25,
    target: 1,
    icon: 'footprints',
    measure: activityCount,
    earnedAt: (activities) => chronological(activities)[0]?.startDate,
  },
  {
    id: 'five-activities',
    title: 'Momentum Maker',
    description: 'Complete 5 synced activities',
    points: 50,
    target: 5,
    icon: 'zap',
    measure: activityCount,
    earnedAt: (activities) => chronological(activities)[4]?.startDate,
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete 50 activities before 7am',
    points: 250,
    target: 50,
    icon: 'moon',
    measure: earlyBirdCount,
    earnedAt: (activities) => chronological(activities).filter(isEarlyBird)[49]?.startDate,
  },
  {
    id: 'iron-will',
    title: 'Iron Will',
    description: 'Maintain a 30-day activity streak',
    points: 300,
    target: 30,
    icon: 'flame',
    measure: longestActivityStreak,
    earnedAt: streakEarnedAt,
  },
  {
    id: 'distance-king',
    title: 'Distance King',
    description: 'Complete 500km total',
    points: 500,
    target: 500,
    icon: 'target',
    measure: totalDistance,
    earnedAt: distanceKingEarnedAt,
  },
];

export function buildRewards(activities = []) {
  const totalPoints = calculateTotalPoints(activities);
  const achievements = achievementDefinitions.map((definition) => {
    const current = Math.min(definition.measure(activities), definition.target);
    const progress = Math.min(Math.round((current / definition.target) * 100), 100);
    const isEarned = current >= definition.target;

    return {
      id: definition.id,
      title: definition.title,
      description: definition.description,
      points: definition.points,
      current: roundMetric(current),
      target: definition.target,
      progress,
      icon: definition.icon,
      status: isEarned ? 'earned' : 'in_progress',
      earnedAt: isEarned ? definition.earnedAt(activities) || null : null,
    };
  });

  return {
    totalPoints,
    tier: getAmbassadorTier(totalPoints),
    achievements,
    earnedAchievements: achievements.filter((achievement) => achievement.status === 'earned'),
    inProgressAchievements: achievements.filter((achievement) => achievement.status === 'in_progress'),
  };
}

function getAmbassadorTier(points) {
  const tiers = [
    { name: 'Bronze', minimum: 0, maximum: 200, nextAt: 200 },
    { name: 'Silver', minimum: 200, maximum: 400, nextAt: 500 },
    { name: 'Gold', minimum: 500, maximum: 800, nextAt: 800 },
    { name: 'Platinum', minimum: 800, maximum: 1000, nextAt: null },
  ];
  const active = points >= 800 ? tiers[3] : points >= 500 ? tiers[2] : points >= 200 ? tiers[1] : tiers[0];
  const next = active.nextAt;

  return {
    ...active,
    progress: next ? Math.min(Math.round((points / next) * 100), 100) : 100,
    pointsToNext: next ? Math.max(next - points, 0) : 0,
    nextName: active.name === 'Bronze' ? 'Silver' : active.name === 'Silver' ? 'Gold' : active.name === 'Gold' ? 'Platinum' : null,
  };
}

function chronological(activities) {
  return [...activities].sort((left, right) => new Date(left.startDate || left.date) - new Date(right.startDate || right.date));
}

function activityCount(activities) {
  return activities.length;
}

function totalDistance(activities) {
  return activities.reduce((sum, activity) => sum + Number(activity.distance || 0), 0);
}

function isEarlyBird(activity) {
  const value = activity.startDateLocal || activity.startDate;
  if (!value) return false;
  const match = String(value).match(/T(\d{2}):/);
  return match ? Number(match[1]) < 7 : new Date(value).getHours() < 7;
}

function earlyBirdCount(activities) {
  return activities.filter(isEarlyBird).length;
}

function uniqueActivityDays(activities) {
  return [...new Set(activities.map((activity) => String(activity.startDateLocal || activity.startDate || '').slice(0, 10)).filter(Boolean))].sort();
}

function longestActivityStreak(activities) {
  const days = uniqueActivityDays(activities);
  let longest = 0;
  let current = 0;
  let previous = null;

  days.forEach((day) => {
    const date = new Date(`${day}T00:00:00Z`);
    const difference = previous ? (date - previous) / 86400000 : 1;
    current = difference === 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = date;
  });

  return longest;
}

function streakEarnedAt(activities) {
  const days = uniqueActivityDays(activities);
  let current = 0;
  let previous = null;
  for (const day of days) {
    const date = new Date(`${day}T00:00:00Z`);
    current = previous && (date - previous) / 86400000 === 1 ? current + 1 : 1;
    if (current >= 30) return date.toISOString();
    previous = date;
  }
  return null;
}

function distanceKingEarnedAt(activities) {
  let distance = 0;
  for (const activity of chronological(activities)) {
    distance += Number(activity.distance || 0);
    if (distance >= 500) return activity.startDate || null;
  }
  return null;
}

function roundMetric(value) {
  return Number.isInteger(value) ? value : Number(value.toFixed(1));
}
