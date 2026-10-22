export function calculateActivityPoints(distanceKm, durationSeconds = 0, activityType = '') {
  if (isDistanceActivity(activityType)) {
    return Math.round(Number(distanceKm || 0) * 10);
  }

  return Math.floor(Number(durationSeconds || 0) / (30 * 60)) * 25;
}

function isDistanceActivity(activityType = '') {
  return /run|walk|ride|cycling|bike|hike/i.test(String(activityType));
}

export function calculateTotalPoints(activities = []) {
  return activities.reduce((total, activity) => total + Number(activity.points || 0), 0);
}
