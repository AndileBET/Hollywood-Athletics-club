import { useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Performance from './pages/Performance.jsx';
import Profile from './pages/Profile.jsx';
import ComingSoon from './components/ComingSoon.jsx';

const pages = {
  Dashboard,
  Performance,
  Rewards: () => <ComingSoon title="Rewards" />,
  Community: () => <ComingSoon title="Community" />,
  Marketplace: () => <ComingSoon title="Marketplace" />,
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
