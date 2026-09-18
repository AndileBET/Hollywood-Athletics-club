import { ArrowUpRight, Award, Flame, LoaderCircle, RefreshCw, Trophy, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ActivityRow from '../components/ActivityRow.jsx';
import Pagination from '../components/Pagination.jsx';
import { getDashboardData, getStravaAuthUrl, syncStravaActivities } from '../api/client.js';

const PAGE_SIZE = 4;

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [page, setPage] = useState(1);

  async function loadDashboardData() {
    const data = await getDashboardData();
    setDashboardData(data);
    setErrorMessage('');
    return data;
  }

  useEffect(() => {
    let mounted = true;
    loadDashboardData().catch((error) => mounted && setErrorMessage(error.message));
    return () => { mounted = false; };
  }, []);

  async function handleSync() {
    setIsSyncing(true);
    setErrorMessage('');
    try {
      const response = await syncStravaActivities();
      await loadDashboardData();
      setPage(1);
      if (response?.imported > 0) {
        setErrorMessage('');
      }
    } catch (error) {
      if (/No Strava token found/i.test(error.message || '')) {
        try {
          const data = await getStravaAuthUrl();
          window.location.assign(data.url);
          return;
        } catch (authError) {
          setErrorMessage(authError.message);
        }
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsSyncing(false);
    }
  }

  const activities = dashboardData?.activities || [];
  const totalPages = Math.max(1, Math.ceil(activities.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleActivities = useMemo(
    () => activities.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [activities, safePage]
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (errorMessage && !dashboardData) return <BackendState title="Dashboard unavailable" message={errorMessage} />;
  if (!dashboardData) return <BackendState title="Loading dashboard" message="Loading activity data..." />;

  const { athlete, dashboardStats, rewards } = dashboardData;
  const currentLevel = rewards?.tier?.name || dashboardStats.strideLevel || 'Starter';
  const firstName = athlete.name?.split(' ')[0] || 'Member';

  return (
    <div className="page-stack dashboard-page">
      {errorMessage ? <div className="info-banner error-banner">{errorMessage}</div> : null}

      <section className="dashboard-hero dashboard-hero-focused">
        <button className="dashboard-hero-sync action-button" onClick={handleSync} type="button" disabled={isSyncing}>
          {isSyncing ? <LoaderCircle className="spin" size={16} /> : <RefreshCw size={16} />}
          {isSyncing ? 'Syncing latest activities...' : 'Sync Latest Activities'}
        </button>
        <div>
          <p className="eyebrow">Hollywood Athletics Club</p>
          <h2>Run with <span className="headline-highlight yellow">purpose</span></h2>
          <p>Welcome back, {firstName}. Your club dashboard keeps your activity, rhythm, level and rewards in one focused view.</p>
        </div>
      </section>

      <section className="stat-grid" aria-label="Dashboard summary">
        <StatCard icon={Award} label="Total Points" value={Number(dashboardStats.totalPoints || 0).toLocaleString()} detail={
  <>
    1 <img src="/images/branding/stars.png" alt="" className="km-star-icon" /> = 10 points
  </>
} />
        <StatCard icon={Zap} label="Activities" value={dashboardStats.activitiesThisMonth || 0} detail={new Date().toLocaleString('en-ZA', { month: 'long', year: 'numeric' })} />
        <StatCard icon={Flame} label="Weekly Streak" value={`${dashboardStats.weeklyStreak || 0} week${dashboardStats.weeklyStreak === 1 ? '' : 's'}`} detail="Activity-based"/>
        <StatCard icon={Trophy} label="Stride Level" value={currentLevel} detail="Your level" />
      </section>

      <section className="panel dashboard-activity-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recent Activities</p>
            <h2>Recent Activities</h2>
          </div>
        </div>
        <div className="activity-list dashboard-activity-list">
          {visibleActivities.length > 0 ? visibleActivities.map((activity) => (
            <ActivityRow activity={activity} compact hideDistance key={activity.id} />
          )) : (
            <EmptyState title="No activities yet" message="No activities are available for this member." />
          )}
        </div>
        <Pagination currentPage={safePage} totalPages={totalPages} onChange={setPage} />
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="stat-card">
      <span className="stat-icon"><Icon aria-hidden="true" size={20} /></span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p className="stat-card-detail">{detail}</p>
      </div>
    </article>
  );
}

function BackendState({ title, message }) {
  return <section className="panel"><h2>{title}</h2><p>{message}</p></section>;
}

function EmptyState({ title, message }) {
  return <div className="empty-state"><h3>{title}</h3><p>{message}</p></div>;
}
