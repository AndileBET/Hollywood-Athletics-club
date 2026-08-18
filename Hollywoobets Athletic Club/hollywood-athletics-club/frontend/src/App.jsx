import { useEffect, useMemo, useState } from "react";

import Layout from "./components/Layout.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Performance from "./pages/Performance.jsx";
import Profile from "./pages/Profile.jsx";
import Community from "./pages/Community.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import Rewards from "./pages/Rewards.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import { supabase } from "./api/supabase.js";

const pages = {
  Dashboard,
  Performance,
  Rewards,
  Community,
  Leaderboard,
  Marketplace,
  Profile,
};

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] =
    useState(true);

  const [activePage, setActivePage] =
    useState("Dashboard");

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setCheckingSession(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const ActivePage = useMemo(
    () => pages[activePage] || Dashboard,
    [activePage]
  );

  if (checkingSession) {
    return (
      <div className="app-loading">
        Loading Hollywood Athletics...
      </div>
    );
  }

  if (!session) {
    return (
      <Login
        onAuthenticated={setSession}
      />
    );
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      <ActivePage />
    </Layout>
  );
}