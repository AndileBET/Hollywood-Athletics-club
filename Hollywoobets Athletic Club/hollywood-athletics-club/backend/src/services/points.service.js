export function calculateActivityPoints(distanceKm) {
  return Math.round(Number(distanceKm || 0) * 10);
}

export function calculateTotalPoints(activities = []) {
  return activities.reduce((total, activity) => total + Number(activity.points || 0), 0);
}
