import {
  Award,
  BarChart3,
  CalendarCheck2,
  Home,
  Medal,
  Menu,
  ShoppingBag,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import StridesBrand from './StridesBrand.jsx';

const navItems = [
  { label: 'Dashboard', icon: Home },
  { label: 'Performance', icon: BarChart3 },
  { label: 'Rewards', icon: Award },
  { label: 'Community', icon: UsersRound },
  { label: 'Bookings', icon: CalendarCheck2 },
  { label: 'Leaderboard', icon: Medal },
  { label: 'Marketplace', icon: ShoppingBag },
  { label: 'Profile', icon: UserRound },
];

export default function Sidebar({ activePage, onNavigate, mobileOpen, onToggleMobile }) {
  function selectPage(label) {
    onNavigate(label);
    onToggleMobile(false);
  }

  return (
    <>
      <header className="mobile-topbar">
        <div className="mobile-brand">
          <StridesBrand compact />
          <div className="mobile-brand-copy">Powered by Hollywood Athletics Club</div>
          <button
            className="mobile-menu-button"
            type="button"
            onClick={() => onToggleMobile(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div
        className={`mobile-drawer-backdrop ${mobileOpen ? 'is-open' : ''}`}
        onClick={() => onToggleMobile(false)}
        aria-hidden="true"
      />

      <aside className={`mobile-drawer ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer-header">
          <div>
            <StridesBrand />
            <div className="brand-caption">Powered by Hollywood Athletics Club</div>
          </div>
          <button type="button" className="icon-button" onClick={() => onToggleMobile(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav mobile-drawer-nav" aria-label="Mobile navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={`nav-button ${activePage === label ? 'is-active' : ''}`}
              key={label}
              onClick={() => selectPage(label)}
              type="button"
            >
              <Icon aria-hidden="true" size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="eyebrow">Club Momentum</p>
          <strong className="sidebar-points-rule">
  1 <img src="/images/branding/stars.png" alt="" className="km-star-icon" /> = 10 points
</strong>
          <p>Move. Track. Progress.</p>
        </div>
      </aside>

      <aside className="sidebar">
        <div className="brand-block">
          <StridesBrand />
          <div className="brand-caption">Powered by Hollywood Athletics Club</div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={`nav-button ${activePage === label ? 'is-active' : ''}`}
              key={label}
              onClick={() => selectPage(label)}
              type="button"
            >
              <Icon aria-hidden="true" size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="eyebrow">Club Momentum</p>
          <strong className="sidebar-points-rule">
  1 <img src="/images/branding/stars.png" alt="" className="km-star-icon" /> = 10 points
</strong>
          <p>Move. Track. Progress.</p>
        </div>
      </aside>
    </>
  );
}
