import { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Performance from './pages/Performance.jsx';
import Profile from './pages/Profile.jsx';
import Community from './pages/Community.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Rewards from './pages/Rewards.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Bookings from './pages/Bookings.jsx';
import { supabase } from './api/supabase.js';

const pages = {
  Dashboard,
  Performance,
  Rewards,
  Community,
  Bookings,
  Leaderboard,
  Marketplace,
  Profile,
};

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [activePage, setActivePage] = useState('Dashboard');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setCheckingSession(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const ActivePage = useMemo(() => pages[activePage] || Dashboard, [activePage]);

  if (checkingSession) {
    return <div className="app-loading">Loading STRIDES...</div>;
  }

  if (!session) {
    return <Login onAuthenticated={setSession} />;
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <ActivePage onNavigate={setActivePage} />
    </Layout>
  );
}
