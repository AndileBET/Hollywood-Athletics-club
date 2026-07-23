import { BadgeCheck, CalendarDays, Mail, MapPin, PlugZap, Trophy } from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import { athlete, profileStats } from '../data/mockData.js';

export default function Profile() {
  const achievementStats = profileStats.achievementStats;

  return (
    <div className="page-stack">
      <section className="profile-header">
        <div className="avatar">{athlete.avatarInitials}</div>
        <div>
          <p className="eyebrow">Athlete Profile</p>
          <h2>{athlete.name}</h2>
          <div className="profile-meta">
            <span><Mail aria-hidden="true" size={15} />{athlete.email}</span>
            <span><CalendarDays aria-hidden="true" size={15} />Member since {athlete.memberSince}</span>
            <span><MapPin aria-hidden="true" size={15} />{athlete.location}</span>
          </div>
        </div>
      </section>

      <section className="stat-grid profile-stats" aria-label="Profile statistics">
        <StatCard icon={BadgeCheck} label="Number of Runs" value={profileStats.numberOfRuns} />
        <StatCard icon={Trophy} label="Total Distance" value={profileStats.totalDistance} />
        <StatCard icon={Trophy} label="Total Points" value={profileStats.totalPoints.toLocaleString()} />
        <StatCard icon={BadgeCheck} label="Total Activities" value={profileStats.totalActivities} />
        <StatCard icon={BadgeCheck} label="Average Distance" value={profileStats.averageDistance} />
        <StatCard icon={BadgeCheck} label="Current Streak" value={profileStats.currentStreak} />
      </section>

      <div className="profile-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Achievement Statistics</p>
              <h2>Club Progress</h2>
            </div>
          </div>
          <div className="achievement-stats">
            <div>
              <strong>{achievementStats.earned}</strong>
              <span>Earned</span>
            </div>
            <div>
              <strong>{achievementStats.inProgress}</strong>
              <span>In Progress</span>
            </div>
            <div>
              <strong>{achievementStats.gold}</strong>
              <span>Gold</span>
            </div>
            <div>
              <strong>{achievementStats.silver}</strong>
              <span>Silver</span>
            </div>
            <div>
              <strong>{achievementStats.bronze}</strong>
              <span>Bronze</span>
            </div>
          </div>
        </section>

        <section className="panel connection-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Connection Status</p>
              <h2>Strava</h2>
            </div>
            <PlugZap aria-hidden="true" size={24} />
          </div>
          <div className="connection-status">
            <span className="status-dot" />
            <strong>{athlete.stravaConnected ? 'Connected' : 'Not connected'}</strong>
          </div>
          <p>
            OAuth and activity sync hooks are reserved for the backend phase. No
            Strava tokens or secrets are stored in this frontend starter.
          </p>
        </section>
      </div>
    </div>
  );
}
