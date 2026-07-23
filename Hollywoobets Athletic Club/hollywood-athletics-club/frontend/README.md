# Hollywood Athletics Club Frontend

Premium React dashboard for a Strava-powered athletics club app. This starter uses mock data while the Supabase and Strava backend is being prepared.

## Stack

- React
- Vite
- Recharts
- lucide-react

## Run Locally

```bash
npm install
npm run dev
```

The app starts on the Dashboard view and uses mock data from `src/data/mockData.js`.

## Pages

- Dashboard: built with athlete summary, recent activities, achievements, points, and Strava status.
- Performance: built with full activity log and three charts.
- Profile: built with member details, activity totals, achievement statistics, and Strava status.
- Rewards, Community, Marketplace: polished coming soon states.

## API Placeholders

Future frontend API helpers live in `src/api/` and assume these backend endpoints:

- `GET /api/dashboard`
- `GET /api/performance`
- `GET /api/profile`
- `GET /api/rewards`
- `GET /api/community`
- `GET /api/marketplace`
