# Hollywood Athletics Club Frontend

Premium React dashboard for a Strava-powered athletics club app. The app reads athlete, activity, profile, and performance data from the backend API.

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

The app starts on the Dashboard view and expects the backend to be running.

Create a local `.env` file in this frontend folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:3000
```

## Pages

- Dashboard: built with athlete summary, recent activities, achievements, points, and Strava status.
- Performance: built with full activity log and three charts.
- Profile: built with member details, activity totals, achievement statistics, and Strava status.
- Rewards, Community, Marketplace: polished coming soon states.

## API

- `GET /api/dashboard`
- `GET /api/performance`
- `GET /api/profile`
- `GET /api/strava/activities`
- `POST /api/strava/sync`
