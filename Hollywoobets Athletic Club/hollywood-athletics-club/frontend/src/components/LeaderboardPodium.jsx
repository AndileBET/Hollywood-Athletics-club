import { Crown, Footprints, Star } from 'lucide-react';

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function PodiumCard({ runner }) {
  const isWinner = runner.rank === 1;

  return (
    <article
      className={`leaderboard-podium-card ${
        isWinner ? 'leaderboard-podium-winner' : ''
      }`}
    >
      <div className="leaderboard-rank-badge">
        {isWinner ? <Crown size={18} /> : `#${runner.rank}`}
      </div>

      <div className="leaderboard-avatar">
        {runner.avatar ? (
          <img src={runner.avatar} alt="" />
        ) : (
          <span>{getInitials(runner.name)}</span>
        )}
      </div>

      <div className="leaderboard-runner-heading">
        <span className="leaderboard-position">
          #{runner.rank}
        </span>

        <h3>{runner.name}</h3>
        <p>{runner.username}</p>
      </div>

      <div className="leaderboard-podium-metrics">
        <div>
          <Footprints size={18} />
          <strong>{runner.distanceKm.toFixed(1)} km</strong>
          <span>Total distance</span>
        </div>

        <div>
          <Star size={18} fill="currentColor" />
          <strong>{runner.stars.toFixed(1)}</strong>
          <span>Purple stars</span>
        </div>
      </div>

      <div className="leaderboard-runs">
        {runner.runs} running sessions
      </div>
    </article>
  );
}

export default function LeaderboardPodium({ runners }) {
  return (
    <section className="leaderboard-podium">
      {runners.map((runner) => (
        <PodiumCard key={runner.id} runner={runner} />
      ))}
    </section>
  );
}