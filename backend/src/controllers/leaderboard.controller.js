import { getLeaderboard as readLeaderboard } from '../services/leaderboard.service.js';
import { resolveUserId } from '../services/supabase.service.js';
export async function getLeaderboard(req, res, next) { try { const userId = await resolveUserId(req); const runners = await readLeaderboard(userId); res.json({ runners, summary: { clubMembers: runners.length, currentUserRank: runners.find((runner) => runner.isCurrentUser)?.rank || null } }); } catch (error) { next(error); } }
