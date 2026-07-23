# Hollywood Athletics Club Backend

Backend starter structure for the Hollywood Athletics Club app. This folder is intentionally scaffold-only for now.

## Planned Stack

- Node.js
- Express
- Supabase PostgreSQL
- Strava OAuth and activity sync

## Structure

- `src/app.js`: future Express app setup.
- `src/server.js`: future server bootstrap.
- `src/config/`: environment and Supabase client setup placeholders.
- `src/routes/`: future API route files for auth, Strava, dashboard, performance, profile, and related app areas.
- `src/controllers/`: future request handlers.
- `src/services/`: future Strava, token, activity, points, stats, achievements, and Supabase helpers.
- `src/middleware/`: future shared Express middleware.
- `src/db/migrations/`: Supabase PostgreSQL migration placeholders.
- `src/db/seeds/`: seed data placeholders.

## Environment

Copy `.env.example` to `.env` when backend implementation begins, then add real values locally. Do not commit real Supabase or Strava secrets.

## Strava OAuth

Strava authorization, callback handling, token refresh, and activity import logic should be added later under:

- `src/routes/auth.routes.js`
- `src/controllers/auth.controller.js`
- `src/routes/strava.routes.js`
- `src/controllers/strava.controller.js`
- `src/services/strava.service.js`
- `src/services/token.service.js`

## Supabase

Supabase client setup should be added later in `src/config/supabase.js`, with database helper functions in `src/services/supabase.service.js`.
