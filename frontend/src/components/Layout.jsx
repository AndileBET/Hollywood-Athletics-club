import { useState } from 'react';
import Sidebar from './Sidebar.jsx';

export default function Layout({ activePage, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function navigate(page) {
    onNavigate(page);
    setMobileOpen(false);
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        mobileOpen={mobileOpen}
        onToggleMobile={setMobileOpen}
      />
      <main className="main-panel">
        <div className="content-frame">{children}</div>
      </main>
    </div>
  );
}
