import { calculateTotalPoints } from './points.service.js';
import { calculateCurrentStreak } from './stats.service.js';

const achievementDefinitions = [
  { id: 'first-activity', title: 'First Step', description: 'Complete your first synced activity', points: 25, target: 1, icon: 'footprints', measure: (a) => a.length },
  { id: 'five-activities', title: 'Momentum Maker', description: 'Complete 5 activities', points: 50, target: 5, icon: 'zap', measure: (a) => a.length },
  { id: 'early-bird', title: 'Club Events', description: 'Complete 4 time trials in a month', points: 250, target: 4, icon: 'moon', measure: (a) => {
    const counts = new Map();
    a.filter((activity) => /time trial/i.test(activity.type || activity.name || '')).forEach((activity) => {
      const date = activity.startDate || activity.start_date || activity.date;
      if (!date) return;
      const month = String(date).slice(0, 7);
      counts.set(month, (counts.get(month) || 0) + 1);
    });
    return Math.max(0, ...counts.values(), 0);
  } },
  { id: 'iron-will', title: 'Unstoppable Strides', description: 'Maintain a 30-day activity streak', points: 300, target: 30, icon: 'flame', measure: (a) => calculateCurrentStreak(a) },
  { id: 'distance-king', title: 'Distance Master', description: 'Complete 500km total', points: 500, target: 500, icon: 'target', measure: (a) => a.reduce((sum, item) => sum + Number(item.distance || 0), 0) },
  { id: 'speed-demon', title: 'Pace Setter', description: 'Complete a 5km activity under 20 minutes', points: 300, target: 1, icon: 'zap', measure: (a) => a.filter((activity) => Number(activity.distance || 0) >= 5 && durationSeconds(activity.duration) < 1200).length },
];

export function buildRewards(activities = []) {
  const totalPoints = calculateTotalPoints(activities);
  const achievements = achievementDefinitions.map((definition) => {
    const current = Math.min(definition.measure(activities), definition.target);
    const progress = Math.min(Math.round((current / definition.target) * 100), 100);
    const earned = current >= definition.target;
    return { id: definition.id, title: definition.title, description: definition.description, points: definition.points, current: roundMetric(current), target: definition.target, progress, icon: definition.icon, status: earned ? 'earned' : 'in_progress', earnedAt: earned ? new Date().toISOString() : null };
  });
  return { totalPoints, tier: getStrideTier(totalPoints), achievements, earnedAchievements: achievements.filter((item) => item.status === 'earned'), inProgressAchievements: achievements.filter((item) => item.status === 'in_progress') };
}

function getStrideTier(points) {
  const tiers = [
    { name: 'Starter', minimum: 0, maximum: 1999, nextAt: 2000, nextName: 'Mover' },
    { name: 'Mover', minimum: 2000, maximum: 4999, nextAt: 5000, nextName: 'Performer' },
    { name: 'Performer', minimum: 5000, maximum: 7999, nextAt: 8000, nextName: 'Champion' },
    { name: 'Champion', minimum: 8000, maximum: null, nextAt: null, nextName: null },
  ];
  const active = points >= 8000 ? tiers[3] : points >= 5000 ? tiers[2] : points >= 2000 ? tiers[1] : tiers[0];
  return { ...active, progress: active.nextAt ? Math.min(Math.round((points / active.nextAt) * 100), 100) : 100, pointsToNext: active.nextAt ? Math.max(active.nextAt - points, 0) : 0 };
}

function durationSeconds(value = '') { const parts = String(value).split(':').map(Number); if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; if (parts.length === 2) return parts[0] * 60 + parts[1]; return Number.POSITIVE_INFINITY; }
function roundMetric(value) { return Number.isInteger(value) ? value : Number(Number(value).toFixed(1)); }
