import { useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Performance from './pages/Performance.jsx';
import Profile from './pages/Profile.jsx';
import Community from './pages/Community.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ComingSoon from './components/ComingSoon.jsx';

const pages = {
  Dashboard,
  Performance,
  Rewards: () => <ComingSoon title="Rewards" />,
  Community,
  Marketplace,
  Profile,
};

export default function App() {
  const [activePage, setActivePage] = useState('Profile');
  const ActivePage = useMemo(() => pages[activePage] || Dashboard, [activePage]);

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <ActivePage />
    </Layout>
  );
}