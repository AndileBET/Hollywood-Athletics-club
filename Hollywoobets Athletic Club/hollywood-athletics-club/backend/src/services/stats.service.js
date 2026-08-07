import { calculateTotalPoints } from './points.service.js';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function buildDashboardStats(activities = []) {
  const totalDistance = activities.reduce((total, activity) => total + Number(activity.distance || 0), 0);

  return {
    totalDistance: `${totalDistance.toFixed(1)} km`,
    runsThisMonth: activities.length,
    currentStreak: `${calculateCurrentStreak(activities)} days`,
    totalPoints: calculateTotalPoints(activities),
  };
}

export function buildProfileStats(activities = [], achievements = []) {
  const totalDistance = activities.reduce((total, activity) => total + Number(activity.distance || 0), 0);
  const earnedAchievements = achievements.filter((achievement) => achievement.progress >= 100);

  return {
    numberOfRuns: activities.length,
    totalDistance: `${totalDistance.toFixed(1)} km`,
    totalPoints: calculateTotalPoints(activities),
    totalActivities: activities.length,
    averageDistance: activities.length ? `${(totalDistance / activities.length).toFixed(1)} km` : '0.0 km',
    currentStreak: `${calculateCurrentStreak(activities)} days`,
    achievementStats: {
      earned: earnedAchievements.length,
      inProgress: achievements.length - earnedAchievements.length,
      gold: achievements.filter((achievement) => achievement.tier === 'Gold').length,
      silver: achievements.filter((achievement) => achievement.tier === 'Silver').length,
      bronze: achievements.filter((achievement) => achievement.tier === 'Bronze').length,
    },
  };
}

export function buildPerformanceStats(activities = []) {
  return {
    monthlyDistanceData: buildMonthlyDistanceData(activities),
    paceTrendData: buildPaceTrendData(activities),
    activityCountData: buildActivityCountData(activities),
  };
}

function buildMonthlyDistanceData(activities) {
  const grouped = groupByMonth(activities);

  return Object.entries(grouped).map(([month, rows]) => ({
    month,
    distance: Number(rows.reduce((total, activity) => total + Number(activity.distance || 0), 0).toFixed(1)),
  }));
}

function buildActivityCountData(activities) {
  const grouped = groupByMonth(activities);

  return Object.entries(grouped).map(([month, rows]) => ({
    month,
    count: rows.length,
  }));
}

function buildPaceTrendData(activities) {
  return activities
    .slice()
    .reverse()
    .slice(-6)
    .map((activity, index) => ({
      week: `W${index + 1}`,
      pace: Number(parsePace(activity.pace).toFixed(2)),
    }));
}

function groupByMonth(activities) {
  return activities.reduce((grouped, activity) => {
    const date = new Date(activity.date);
    const month = Number.isNaN(date.getTime()) ? 'Now' : monthLabels[date.getMonth()];
    grouped[month] ||= [];
    grouped[month].push(activity);
    return grouped;
  }, {});
}

function parsePace(value = '') {
  const [minutes = '0', seconds = '0'] = value.replace('/km', '').split(':');
  return Number(minutes) + Number(seconds) / 60;
}

function calculateCurrentStreak(activities) {
  return Math.min(activities.length, 6);
}
