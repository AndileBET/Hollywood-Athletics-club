# Hollywood Athletics Club Backend


## Run Locally

```bash
npm install
npm run dev
```

The API runs on `http://127.0.0.1:3000` by default.

## Environment


```env
NODE_ENV=development
PORT=3000
CLIENT_URL=http://127.0.0.1:5173
API_URL=http://127.0.0.1:3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DEFAULT_USER_ID=
```

Important values:

- `SUPABASE_URL`: your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: backend-only Supabase service role key.
- `DEFAULT_USER_ID`: the `public.profiles.id` value to use when the frontend does not pass a user ID.

Do not commit real `.env` files or real API keys.

## Reusable Services

API setup is centralized in two backend services:

- `src/services/supabase.service.js`: creates and reuses the Supabase client, validates Supabase configuration, resolves the local user ID, and contains profile helpers.


## API Routes

- `GET /health`: service health check.
- `GET /api/dashboard`: dashboard profile, stats, activities, and achievements.
- `GET /api/performance`: activity history and chart data.
- `GET /api/profile`: athlete profile and profile stats.
- `POST /api/profile`: upsert an athlete profile row.

Dashboard, performance, profile, and activity endpoints require Supabase configuration and a user ID. Use `DEFAULT_USER_ID` for local development after creating your first `public.profiles` row.

## Database

Run the SQL files in `src/db/migrations` in order, then run `src/db/seeds/achievements.sql`.

The tables created are:

- `profiles`
- `activities`
- `achievements`
- `user_achievements`
