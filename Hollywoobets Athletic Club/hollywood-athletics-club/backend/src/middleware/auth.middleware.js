import { requireSupabase } from "../services/supabase.service.js";

export async function requireAuth(req, res, next) {
  try {
    const authorization =
      req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const accessToken =
      authorization.slice("Bearer ".length);

    const supabase = requireSupabase();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired session.",
      });
    }

    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    next(error);
  }
}