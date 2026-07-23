import Sidebar from './Sidebar.jsx';

export default function Layout({ activePage, onNavigate, children }) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="main-panel">
        <div className="content-frame">{children}</div>
      </main>
    </div>
  );
}
