export function calculateActivityPoints(_distanceKm, durationSeconds = 0) {
  return Math.floor(Number(durationSeconds || 0) / (30 * 60)) * 25;
}

export function calculateTotalPoints(activities = []) {
  return activities.reduce((total, activity) => total + Number(activity.points || 0), 0);
}
