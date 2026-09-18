function getInitials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function Rank({ rank }) {
  if (rank <= 3) return <span className="table-rank medal">{rank}</span>;
  return <span className="table-rank">{rank}</span>;
}

export default function LeaderboardTable({ runners }) {
  return (
    <section className="panel leaderboard-table-panel">
      <div className="section-heading"><div><p className="eyebrow">Club Standings</p><h2>Club Standings</h2></div></div>
      <div className="leaderboard-table-scroll">
        <table className="leaderboard-table">
          <thead><tr><th>Rank</th><th>Club Member</th><th>Activities</th><th>Purple Stars</th></tr></thead>
          <tbody>
            {runners.map((runner) => (
              <tr key={runner.id} className={runner.isCurrentUser ? 'leaderboard-current-user' : ''}>
                <td><Rank rank={runner.rank} /></td>
                <td><div className="leaderboard-user"><div className="leaderboard-table-avatar">{runner.avatar ? <img src={runner.avatar} alt="" /> : <span>{getInitials(runner.name)}</span>}</div><div><strong>{runner.name}{runner.isCurrentUser ? <span className="you-badge">YOU</span> : null}</strong><span>{runner.username}</span></div></div></td>
                <td>{runner.runs}</td>
                <td>
  <strong className="distance-with-star">
    {Number(runner.distanceKm || 0).toFixed(1)}
    <img src="/images/branding/stars.png" alt="" className="km-star-icon" />
  </strong>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
