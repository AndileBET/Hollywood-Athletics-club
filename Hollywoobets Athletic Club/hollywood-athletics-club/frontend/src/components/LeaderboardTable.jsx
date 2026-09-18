import { Star } from 'lucide-react';

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Rank({ rank }) {
  if (rank === 1) {
    return <span className="table-rank medal gold">1</span>;
  }

  if (rank === 2) {
    return <span className="table-rank medal silver">2</span>;
  }

  if (rank === 3) {
    return <span className="table-rank medal bronze">3</span>;
  }

  return <span className="table-rank">{rank}</span>;
}

export default function LeaderboardTable({ runners }) {
  return (
    <section className="panel leaderboard-table-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Club Standings</p>
          <h2>Global Ranking</h2>
        </div>

        <div className="leaderboard-star-rule">
          <Star size={17} fill="currentColor" />
          <span>1 km = 1 purple star</span>
        </div>
      </div>

      <div className="leaderboard-table-scroll">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Runner</th>
              <th>Runs</th>
              <th>Distance</th>
              <th>Purple Stars</th>
            </tr>
          </thead>

          <tbody>
            {runners.map((runner) => (
              <tr
                key={runner.id}
                className={
                  runner.isCurrentUser
                    ? 'leaderboard-current-user'
                    : ''
                }
              >
                <td>
                  <Rank rank={runner.rank} />
                </td>

                <td>
                  <div className="leaderboard-user">
                    <div className="leaderboard-table-avatar">
                      {runner.avatar ? (
                        <img
                          src={runner.avatar}
                          alt={`${runner.name} avatar`}
                        />
                      ) : (
                        <span>{getInitials(runner.name)}</span>
                      )}
                    </div>

                    <div>
                      <strong>
                        {runner.name}

                        {runner.isCurrentUser && (
                          <span className="you-badge">
                            YOU
                          </span>
                        )}
                      </strong>

                      <span>{runner.username}</span>
                    </div>
                  </div>
                </td>

                <td>{runner.runs}</td>

                <td>
                  <strong>
                    {runner.distanceKm.toFixed(1)} km
                  </strong>
                </td>

                <td>
                  <div className="purple-star-score">
                    <Star
                      size={19}
                      fill="currentColor"
                      aria-hidden="true"
                    />

                    <strong>{runner.stars}</strong>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}