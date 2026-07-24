import { Award, Flame, Footprints, Gauge, LoaderCircle, PlugZap, RefreshCw, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import ActivityRow from '../components/ActivityRow.jsx';
import AchievementBadge from '../components/AchievementBadge.jsx';
import StatCard from '../components/StatCard.jsx';
import { getDashboardData, getStravaAuthUrl, syncStravaActivities } from '../api/client.js';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  async function loadDashboardData() {
    const data = await getDashboardData();
    setDashboardData(data);
    setErrorMessage('');

    return data;
  }

  useEffect(() => {
    let isMounted = true;

    loadDashboardData()
      .then((data) => {
        if (!isMounted) {
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const stravaState = params.get('strava');

        if (stravaState === 'connected' && data.athlete.stravaConnected) {
          setSyncMessage('Strava connected successfully. Import your latest activities to populate the dashboard.');
          window.history.replaceState({}, '', window.location.pathname);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleConnectStrava() {
    setIsConnecting(true);
    setSyncMessage('');

    try {
      const data = await getStravaAuthUrl();
      window.location.assign(data.url);
    } catch (error) {
      setErrorMessage(error.message);
      setIsConnecting(false);
    }
  }

  async function handleSyncStrava() {
    setIsSyncing(true);
    setSyncMessage('');
    setErrorMessage('');

    try {
      const response = await syncStravaActivities();
      await loadDashboardData();

      setSyncMessage(
        response.imported > 0
          ? `Imported ${response.imported} Strava activit${response.imported === 1 ? 'y' : 'ies'} into the club dashboard.`
          : 'No new Strava activities were available to import.',
          console.log(stravaActivity),
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSyncing(false);
    }
  }

  if (errorMessage) {
    return <BackendState title="Dashboard unavailable" message={errorMessage} />;
  }

  if (!dashboardData) {
    return <BackendState title="Loading dashboard" message="Loading data..." />;
  }

  const { achievements, activities, athlete, dashboardStats } = dashboardData;
  const recentActivities = activities.slice(0, 4);
  const isStravaConnected = athlete.stravaConnected;

  return (
    <div className="page-stack">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Hollywood Athletics Club</p>
          <h2>Welcome back, {athlete.name.split(' ')[0]}</h2>
          <p>
            Your Strava-powered club dashboard is tracking distance, pace,
            consistency, and rewards through the backend integration.
          </p>
        </div>
        <div className="strava-card">
          <div className="strava-icon">
            <PlugZap aria-hidden="true" size={23} />
          </div>
          <div>
            <span>{athlete.stravaConnected ? 'Strava Connected' : 'Connected with Strava'}</span>
            <p>Sync-ready structure for activity imports and OAuth.</p>
          </div>
        </div>
      </section>

      <section className="panel connection-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Strava Integration</p>
            <h2>Connect and import activities</h2>
          </div>
          <div className="connection-actions">
            {!isStravaConnected ? (
              <button className="action-button" onClick={handleConnectStrava} type="button" disabled={isConnecting}>
                {isConnecting ? <LoaderCircle aria-hidden="true" className="spin" size={16} /> : <PlugZap aria-hidden="true" size={16} />}
                {isConnecting ? 'Opening Strava...' : 'Connect Strava'}
              </button>
            ) : (
              <button className="action-button" onClick={handleSyncStrava} type="button" disabled={isSyncing}>
                {isSyncing ? <LoaderCircle aria-hidden="true" className="spin" size={16} /> : <RefreshCw aria-hidden="true" size={16} />}
                {isSyncing ? 'Syncing activities...' : 'Sync latest activities'}
              </button>
            )}
          </div>
        </div>

        <div className="connection-status">
          <span className={`status-dot ${isStravaConnected ? 'is-connected' : 'is-disconnected'}`} />
          <strong>{isStravaConnected ? 'Ready to import from Strava' : 'No Strava connection yet'}</strong>
        </div>

        {/* <p>
          Strava sends activity objects through the API, and this app normalizes each one into your own
          {' '}<code>activities</code>{' '}
          table with distance, moving time, pace, elevation, and points.
        </p> */}

        

        {syncMessage ? <div className="info-banner success-banner">{syncMessage}</div> : null}
      </section>

      <section className="stat-grid" aria-label="Dashboard summary">
        <StatCard icon={Footprints} label="Total Distance" value={dashboardStats.totalDistance} detail="All synced runs" />
        <StatCard icon={Gauge} label="Runs This Month" value={dashboardStats.runsThisMonth} detail="March 2026" />
        <StatCard icon={Flame} label="Current Streak" value={dashboardStats.currentStreak} detail="Active training rhythm" />
        <StatCard icon={Trophy} label="Total Points" value={dashboardStats.totalPoints.toLocaleString()} detail="1 km = 10 points" />
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest Sessions</p>
              <h2>Recent Running Activities</h2>
            </div>
          </div>
          <div className="activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <ActivityRow activity={activity} compact key={activity.id} />
              ))
            ) : (
              <EmptyState
                title={isStravaConnected ? 'No synced activities yet' : 'No Strava data yet'}
                message={
                  isStravaConnected
                    ? 'Run a sync to pull your latest Strava sessions into the dashboard.'
                    : 'Connect Strava to start displaying your running activity in the UI.'
                }
              />
            )}
          </div>
        </section>

        <section className="panel points-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Rewards Engine</p>
              <h2>Total Points</h2>
            </div>
            <Award aria-hidden="true" size={24} />
          </div>
          <strong>{dashboardStats.totalPoints.toLocaleString()}</strong>
          <p>Every kilometre earns 10 points. Keep the streak alive and unlock club achievements as the backend grows.</p>
          <div className="points-rule">
            <span>8.5 km run</span>
            <b>= 85 points</b>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Progress Markers</p>
            <h2>Achievements</h2>
          </div>
        </div>
        <div className="achievement-grid">
          {achievements.map((achievement) => (
            <AchievementBadge achievement={achievement} key={achievement.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BackendState({ title, message }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
