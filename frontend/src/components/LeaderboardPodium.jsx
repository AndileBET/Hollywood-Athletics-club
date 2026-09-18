import { Crown, Footprints } from 'lucide-react';

function getInitials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function PodiumCard({ runner }) {
  const isWinner = runner.rank === 1;
  return (
    <article className={`leaderboard-podium-card ${isWinner ? 'leaderboard-podium-winner' : ''}`}>
      <div className="leaderboard-rank-badge">{isWinner ? <Crown size={18} /> : `#${runner.rank}`}</div>
      <div className="leaderboard-avatar">{runner.avatar ? <img src={runner.avatar} alt="" /> : <span>{getInitials(runner.name)}</span>}</div>
      <div className="leaderboard-runner-heading"><span className="leaderboard-position">#{runner.rank}</span><h3>{runner.name}</h3><p>{runner.username}</p></div>
      <strong className="distance-with-star">
  {Number(runner.distanceKm || 0).toFixed(1)}
  <img src="/images/branding/stars.png" alt="" className="km-star-icon" />
</strong>
      <div className="leaderboard-runs">{runner.runs} activities</div>
    </article>
  );
}

export default function LeaderboardPodium({ runners }) {
  return <section className="leaderboard-podium">{runners.map((runner) => <PodiumCard key={runner.id} runner={runner} />)}</section>;
}
