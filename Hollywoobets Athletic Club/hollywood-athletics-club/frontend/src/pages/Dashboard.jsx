import { Award, Flame, Footprints, Gauge, PlugZap, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import ActivityRow from '../components/ActivityRow.jsx';
import AchievementBadge from '../components/AchievementBadge.jsx';
import StatCard from '../components/StatCard.jsx';
import { getDashboardData } from '../api/client.js';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    getDashboardData()
      .then((data) => {
        if (isMounted) {
          setDashboardData(data);
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

  if (errorMessage) {
    return <BackendState title="Dashboard unavailable" message={errorMessage} />;
  }

  if (!dashboardData) {
    return <BackendState title="Loading dashboard" message="Loading data..." />;
  }

  const { achievements, activities, athlete, dashboardStats } = dashboardData;
  const recentActivities = activities.slice(0, 4);

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
            {recentActivities.map((activity) => (
              <ActivityRow activity={activity} compact key={activity.id} />
            ))}
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
      <p className="eyebrow">Backend</p>
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}
