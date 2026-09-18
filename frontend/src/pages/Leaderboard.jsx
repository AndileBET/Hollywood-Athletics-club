import { Footprints, Medal, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import LeaderboardPodium from '../components/LeaderboardPodium.jsx';
import LeaderboardTable from '../components/LeaderboardTable.jsx';
import Pagination from '../components/Pagination.jsx';
import { getLeaderboard } from '../api/client.js';
import { mockLeaderboardUsers } from '../data/leaderboard.mock.js';

function buildFallback(users) {
  return users.slice().sort((a, b) => Number(b.distanceKm || 0) - Number(a.distanceKm || 0)).map((user, index) => ({
    ...user,
    distanceKm: Number(user.distanceKm || 0),
    runs: Number(user.runs || 0),
    rank: index + 1,
  }));
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    let mounted = true;
    getLeaderboard()
      .then((data) => mounted && setLeaderboard(normalizeRunners(data.runners || [])))
      .catch(() => mounted && setLeaderboard(normalizeRunners(buildFallback(mockLeaderboardUsers))));
    return () => { mounted = false; };
  }, []);

  if (!leaderboard) return <section className="panel"><h2>Loading Club Standings</h2><p>Loading athlete rankings...</p></section>;
  if (errorMessage) return <section className="panel"><h2>Club Standings unavailable</h2><p>{errorMessage}</p></section>;

  const topThree = leaderboard.slice(0, 3);
  const currentUser = leaderboard.find((runner) => runner.isCurrentUser);
  const totalPages = Math.max(1, Math.ceil(leaderboard.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const tableRunners = leaderboard.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="page-stack leaderboard-page">
      <section className="leaderboard-hero">
        <div>
          <p className="eyebrow">Club Standings</p>
          <h2>Run to the <span className="headline-highlight yellow">top</span></h2>
          <p>Run consistently and see how you place against other club members.</p>
        </div>
      </section>

      <section className="leaderboard-summary-grid" aria-label="Leaderboard summary">
        <SummaryCard icon={Users} label="Club Members" value={leaderboard.length} detail="Currently ranked" />
        <SummaryCard icon={Medal} label="Your Rank" value={currentUser ? `#${currentUser.rank}` : '—'} detail={currentUser ? `of ${leaderboard.length} members` : 'Not ranked yet'} />
        <SummaryCard icon={Footprints} label="Activities" value={leaderboard.reduce((sum, member) => sum + Number(member.runs || 0), 0)} detail="Across the club" />
      </section>

      <section className="leaderboard-section-heading">
        <div><p className="eyebrow">Club Leaders</p><h2>Club Standings</h2></div>
      </section>
      <LeaderboardPodium runners={topThree} />
      <LeaderboardTable runners={tableRunners} />
      <Pagination currentPage={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function normalizeRunners(runners) {
  return runners.map((runner, index) => ({
    ...runner,
    id: runner.id || `runner-${index}`,
    name: runner.name || 'Club member',
    username: runner.username || '@member',
    distanceKm: Number(runner.distanceKm || 0),
    runs: Number(runner.runs || 0),
    rank: Number(runner.rank || index + 1),
  }));
}

function SummaryCard({ icon: Icon, label, value, detail }) {
  return <article className="leaderboard-summary-card"><span className="leaderboard-summary-icon"><Icon size={22} /></span><div><span>{label}</span><strong>{value}</strong><p className="stat-card-detail">{detail}</p></div></article>;
}
