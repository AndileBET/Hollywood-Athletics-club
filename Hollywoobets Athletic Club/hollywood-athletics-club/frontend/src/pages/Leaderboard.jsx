import {
  Footprints,
  Medal,
  Star,
  Trophy,
  Users,
} from 'lucide-react';

import LeaderboardPodium from '../components/LeaderboardPodium.jsx';
import LeaderboardTable from '../components/LeaderboardTable.jsx';

import { mockLeaderboardUsers } from '../data/leaderboard.mock.js';

function buildLeaderboard(users) {
  return [...users]
    .sort((a, b) => b.distanceKm - a.distanceKm)
    .map((user, index) => ({
      ...user,
      rank: index + 1,

      // Keep decimal stars because distance is our
      // authoritative leaderboard measurement.
      stars: Number(user.distanceKm.toFixed(1)),
    }));
}

export default function Leaderboard() {
  const leaderboard = buildLeaderboard(mockLeaderboardUsers);

  const topThree = leaderboard.slice(0, 3);

  const currentUser = leaderboard.find(
    (runner) => runner.isCurrentUser
  );

  const totalDistance = leaderboard.reduce(
    (total, runner) => total + runner.distanceKm,
    0
  );

  const totalStars = leaderboard.reduce(
    (total, runner) => total + runner.stars,
    0
  );

  return (
    <div className="page-stack leaderboard-page">
      {/* HERO */}

      <section className="leaderboard-hero">
        <div>
          <p className="eyebrow">
            Hollywood Athletics Club
          </p>

          <h2>
            Run to the{' '}
            <span className="headline-highlight yellow">
              top
            </span>
          </h2>

          <p>
            Every kilometre moves you up the Hollywood Athletics
            Club rankings. Run consistently, collect purple stars
            and compete with the club.
          </p>
        </div>

        <div className="leaderboard-hero-card">
          <div className="leaderboard-hero-trophy">
            <Trophy size={30} />
          </div>

          <div>
            <span>Your current position</span>

            <strong>
              #{currentUser?.rank ?? '-'}
            </strong>

            <p>
              {currentUser
                ? `${currentUser.distanceKm.toFixed(
                    1
                  )} km completed`
                : 'Start running to enter the rankings'}
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY */}

      <section
        className="leaderboard-summary-grid"
        aria-label="Leaderboard summary"
      >
        <SummaryCard
          icon={Users}
          label="Club Runners"
          value={leaderboard.length}
          detail="Currently ranked"
        />

        <SummaryCard
          icon={Footprints}
          label="Club Distance"
          value={`${totalDistance.toFixed(1)} km`}
          detail="Combined distance"
        />

        <SummaryCard
          icon={Medal}
          label="Your Rank"
          value={
            currentUser
              ? `#${currentUser.rank}`
              : '—'
          }
          detail={
            currentUser
              ? `of ${leaderboard.length} runners`
              : 'Not ranked yet'
          }
        />

        <SummaryCard
          icon={Star}
          label="Purple Stars"
          value={totalStars.toFixed(1)}
          detail="Earned by the club"
          star
        />
      </section>

      {/* TOP THREE */}

      <section className="leaderboard-section-heading">
        <div>
          <p className="eyebrow">Top Performers</p>
          <h2>Club Leaders</h2>
        </div>

        <p>
          The runners setting the pace across the Hollywood
          Athletics Club.
        </p>
      </section>

      <LeaderboardPodium runners={topThree} />

      {/* FULL TABLE */}

      <LeaderboardTable runners={leaderboard} />
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  star = false,
}) {
  return (
    <article className="leaderboard-summary-card">
      <span
        className={`leaderboard-summary-icon ${
          star ? 'purple-star-icon' : ''
        }`}
      >
        <Icon
          size={22}
          fill={star ? 'currentColor' : 'none'}
        />
      </span>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{detail}</p>
      </div>
    </article>
  );
}