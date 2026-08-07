import {
  Award,
  BarChart3,
  Home,
  ShoppingBag,
  UserRound,
  UsersRound,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home },
  { label: 'Performance', icon: BarChart3 },
  { label: 'Rewards', icon: Award },
  { label: 'Community', icon: UsersRound },
  { label: 'Marketplace', icon: ShoppingBag },
  { label: 'Profile', icon: UserRound },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark logo-mark">
            <img
              src="/images/branding/hollywoodbets-logo.png"
              alt="Hollywoodbets logo"
              className="brand-logo"
            /> 
          </div>
          <div>
            <p className="eyebrow">Running Together</p>
            <h1>Hollywood Athletics Club</h1>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              className={`nav-button ${activePage === label ? 'is-active' : ''}`}
              key={label}
              onClick={() => onNavigate(label)}
              type="button"
            >
              <Icon aria-hidden="true" size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="eyebrow">Club Momentum</p>
          <strong>1 km = 10 points</strong>
          <p>Move with the club, collect rewards, and keep the community energy high.</p>
        </div>
      </aside>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            className={`mobile-nav-button ${activePage === label ? 'is-active' : ''}`}
            key={label}
            onClick={() => onNavigate(label)}
            type="button"
            title={label}
            aria-label={label}
          >
            <Icon aria-hidden="true" size={20} />
          </button>
        ))}
      </nav>
    </>
  );
}
