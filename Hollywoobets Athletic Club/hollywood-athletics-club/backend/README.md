# Hollywood Athletics Club Backend

Express API for the Hollywood Athletics Club frontend, with Supabase storage and Strava OAuth/activity sync hooks.

## Run Locally

```bash
npm install
npm run dev
```

The API runs on `http://127.0.0.1:3000` by default.

## Environment

Create a local `.env` file in this backend folder, then add your own Supabase and Strava values.

```env
NODE_ENV=development
PORT=3000
CLIENT_URL=http://127.0.0.1:5173
API_URL=http://127.0.0.1:3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DEFAULT_USER_ID=
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
STRAVA_REDIRECT_URI=http://127.0.0.1:3000/api/auth/strava/callback
```

Important values:

- `SUPABASE_URL`: your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: backend-only Supabase service role key.
- `DEFAULT_USER_ID`: the `public.profiles.id` value to use when the frontend does not pass a user ID.
- `STRAVA_CLIENT_ID`: your Strava app client ID.
- `STRAVA_CLIENT_SECRET`: your Strava app client secret.
- `STRAVA_REDIRECT_URI`: must match the callback URL configured in Strava.

Do not commit real `.env` files or real API keys.

## Reusable Services

API setup is centralized in two backend services:

- `src/services/supabase.service.js`: creates and reuses the Supabase client, validates Supabase configuration, resolves the local user ID, and contains profile helpers.
- `src/services/strava.service.js`: validates Strava configuration, builds OAuth URLs, exchanges and refreshes tokens, stores tokens, and fetches Strava activities.

When adding new backend features, import these services instead of creating another Supabase or Strava client.

## API Routes

- `GET /health`: service health check.
- `GET /api/dashboard`: dashboard profile, stats, activities, and achievements.
- `GET /api/performance`: activity history and chart data.
- `GET /api/profile`: athlete profile and profile stats.
- `POST /api/profile`: upsert an athlete profile row.
- `GET /api/auth/strava/url?userId=<uuid>`: generate a Strava OAuth URL.
- `GET /api/auth/strava/callback`: Strava OAuth callback.
- `GET /api/strava/activities?userId=<uuid>`: list stored activities.
- `POST /api/strava/sync?userId=<uuid>`: fetch Strava activities and save them to Supabase.

Dashboard, performance, profile, and activity endpoints require Supabase configuration and a user ID. Use `DEFAULT_USER_ID` for local development after creating your first `public.profiles` row.

## Database

Run the SQL files in `src/db/migrations` in order, then run `src/db/seeds/achievements.sql`.

The tables created are:

- `profiles`
- `strava_connections`
- `activities`
- `achievements`
- `user_achievements`
