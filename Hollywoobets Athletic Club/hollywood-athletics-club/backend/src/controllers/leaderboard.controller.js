import { getLeaderboard as readLeaderboard } from '../services/leaderboard.service.js';
import { resolveUserId } from '../services/supabase.service.js';

export async function getLeaderboard(req, res, next) {
  try {
    const userId = await resolveUserId(req);
    const runners = await readLeaderboard(userId);
    const totalDistance = runners.reduce((sum, runner) => sum + runner.distanceKm, 0);

    res.json({
      runners,
      summary: {
        clubRunners: runners.length,
        clubDistanceKm: Number(totalDistance.toFixed(1)),
        purpleStars: Number(totalDistance.toFixed(1)),
        currentUserRank: runners.find((runner) => runner.isCurrentUser)?.rank || null,
      },
    });
  } catch (error) {
    next(error);
  }
}
