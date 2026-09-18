# STRIDES Latest Update

Applied only the requested changes to the latest baseline.

## Strava sync
- Restored the working OAuth connection flow and server-side activity sync.
- `Sync Latest Activities` now performs a real sync against the authenticated user's connected account.
- If the user has not connected an account yet, the same button opens the authorization flow.
- Synced activities are upserted into `public.activities` using the unique activity id.
- Existing Dashboard layout and pagination are preserved.

## Stride tiers
- Starter: 0 - 1999 points
- Mover: 2000 - 4999 points
- Performer: 5000 - 7999 points
- Champion: 8000+ points

No other UI redesign was intentionally introduced in this update.
