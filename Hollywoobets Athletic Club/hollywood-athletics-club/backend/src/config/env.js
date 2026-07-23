import dotenv from 'dotenv';

dotenv.config();

const readEnv = (name, fallback = '') => (process.env[name] || fallback).trim();
const nodeEnv = readEnv('NODE_ENV', 'development');
const allowSelfSignedCertificates =
  readEnv('ALLOW_SELF_SIGNED_CERTIFICATES').toLowerCase() === 'true';

if (allowSelfSignedCertificates && nodeEnv !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const env = {
  nodeEnv,
  port: Number(readEnv('PORT', '3000')),
  clientUrl: readEnv('CLIENT_URL', 'http://127.0.0.1:5173'),
  apiUrl: readEnv('API_URL', 'http://127.0.0.1:3000'),
  defaultUserId: readEnv('DEFAULT_USER_ID') || null,
  allowSelfSignedCertificates,
  supabase: {
    url: readEnv('SUPABASE_URL'),
    serviceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY'),
  },
  strava: {
    clientId: readEnv('STRAVA_CLIENT_ID'),
    clientSecret: readEnv('STRAVA_CLIENT_SECRET'),
    redirectUri:
      readEnv('STRAVA_REDIRECT_URI') ||
      'http://127.0.0.1:3000/api/auth/strava/callback',
  },
};
