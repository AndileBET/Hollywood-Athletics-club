import { Award, CheckCircle2, Moon, Flame, Medal, ShieldCheck, Star, Target, Trophy, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getRewards } from '../api/client.js';
import Pagination from '../components/Pagination.jsx';

const tierCopy = {
  Starter: { tone: 'starter', minimum: 0, maximum: 1999 },
  Mover: { tone: 'mover', minimum: 2000, maximum: 4999 },
  Performer: { tone: 'performer', minimum: 5000, maximum: 7999 },
  Champion: { tone: 'champion', minimum: 8000, maximum: null },
};

const iconMap = { moon: Moon, flame: Flame, target: Target, trophy: Trophy, medal: Medal, zap: Zap };

export default function Rewards() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [inProgressPage, setInProgressPage] = useState(1);
  const [earnedPage, setEarnedPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    getRewards()
      .then((value) => mounted && setData(value))
      .catch((error) => mounted && setErrorMessage(error.message));
    return () => { mounted = false; };
  }, []);

  const safeData = data || {
    tier: { name: 'Starter', nextName: 'Mover', progress: 0, pointsToNext: 0 },
    totalPoints: 0,
    inProgressAchievements: [],
    earnedAchievements: [],
  };
  const activeName = safeData.tier?.name || 'Starter';
  const tiers = ['Starter', 'Mover', 'Performer', 'Champion'].map((name) => ({
    name,
    ...tierCopy[name],
    active: name === activeName,
  }));

  const achievementPageSize = 3;
  const inProgressAchievements = Array.isArray(safeData.inProgressAchievements) ? safeData.inProgressAchievements : [];
  const earnedAchievements = Array.isArray(safeData.earnedAchievements) ? safeData.earnedAchievements : [];
  const inProgressTotalPages = Math.max(1, Math.ceil(inProgressAchievements.length / achievementPageSize));
  const earnedTotalPages = Math.max(1, Math.ceil(earnedAchievements.length / achievementPageSize));
  const safeInProgressPage = Math.min(inProgressPage, inProgressTotalPages);
  const safeEarnedPage = Math.min(earnedPage, earnedTotalPages);
  const visibleInProgress = useMemo(() => inProgressAchievements.slice((safeInProgressPage - 1) * achievementPageSize, safeInProgressPage * achievementPageSize), [inProgressAchievements, safeInProgressPage]);
  const visibleEarned = useMemo(() => earnedAchievements.slice((safeEarnedPage - 1) * achievementPageSize, safeEarnedPage * achievementPageSize), [earnedAchievements, safeEarnedPage]);

  if (errorMessage) return <BackendState title="Rewards unavailable" message={errorMessage} />;
  if (!data) return <BackendState title="Loading rewards" message="Loading your Stride Level and achievements..." />;

  return (
    <div className="rewards-page">
      <header className="rewards-title">
        <h2>Chase your <span className="headline-highlight yellow">next</span> milestone</h2>
        <p>Every activity point contributes to your Stride Level.</p>
      </header>

      <section className="rewards-level-card" aria-label="Current Stride Level">
        <div className="rewards-level-top">
          <div className="rewards-level-heading">
            <span className="rewards-star"><Star aria-hidden="true" size={19} /></span>
            <h3>Stride Level: {activeName}</h3>
          </div>
          <span className="rewards-points-badge">{Number(safeData.totalPoints || 0).toLocaleString()} Points</span>
        </div>

        <div className="tier-progress">
          <div><strong>{safeData.tier.nextName ? `Progress to ${safeData.tier.nextName}` : 'Highest Stride Level'}</strong><span>{Number(safeData.totalPoints || 0).toLocaleString()} points</span></div>
          <div className="rewards-progress-track" aria-hidden="true"><div style={{ width: `${safeData.tier.progress}%` }} /></div>
          <p>{safeData.tier.pointsToNext ? `${safeData.tier.pointsToNext} points until ${safeData.tier.nextName}` : 'You have reached Champion.'}</p>
        </div>
      </section>

      <section className="rewards-panel">
        <h3>Stride Tiers</h3>
        <div className="tier-grid">
          {tiers.map((tier) => (
            <article className={`tier-card ${tier.tone} ${tier.active ? 'is-active' : ''}`} key={tier.name}>
              <div className="tier-card-heading">
                <Award aria-hidden="true" size={31} />
                <div><h4>{tier.name}</h4><p>{tier.maximum ? `${tier.minimum} - ${tier.maximum} points` : `${tier.minimum}+ points`}</p></div>
                {tier.active ? <span>Active</span> : null}
              </div>
              <ul>
                <li>Points earned from club activities</li>
                <li>Progress shown across Strides</li>
                <li>Level updates automatically</li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rewards-panel">
        <h3>In Progress</h3>
        <div className="achievement-progress-grid">
          {visibleInProgress.map((achievement) => <AchievementCard achievement={achievement} key={achievement.id} />)}
        </div>
        <Pagination currentPage={safeInProgressPage} totalPages={inProgressTotalPages} onChange={setInProgressPage} />
      </section>

      <section className="rewards-panel">
        <h3>Earned Achievements ({earnedAchievements.length})</h3>
        <div className="earned-grid">
          {visibleEarned.map((achievement) => <EarnedCard achievement={achievement} key={achievement.id} />)}
        </div>
        <Pagination currentPage={safeEarnedPage} totalPages={earnedTotalPages} onChange={setEarnedPage} />
      </section>
    </div>
  );
}

function AchievementCard({ achievement }) {
  const Icon = iconMap[achievement.icon] || Zap;
  return (
    <article className="achievement-progress-card">
      <div className="achievement-card-top"><span className="achievement-icon blue"><Icon size={20} /></span><div><h4>{achievement.title}</h4><p>{achievement.description}</p></div></div>
      <div className="achievement-progress-meta"><span>Progress</span><strong>{achievement.current}/{achievement.target}</strong></div>
      <div className="rewards-progress-track" aria-hidden="true"><div style={{ width: `${achievement.progress}%` }} /></div>
      <div className="achievement-card-bottom"><span>{achievement.points} pts</span><small>{achievement.progress}% complete</small></div>
    </article>
  );
}

function EarnedCard({ achievement }) {
  const Icon = iconMap[achievement.icon] || Trophy;
  return (
    <article className="earned-card">
      <span className="achievement-icon green"><Icon size={21} /></span>
      <div><h4>{achievement.title}</h4><p>{achievement.description}</p><span>{achievement.points} pts</span></div>
      <div className="earned-status"><ShieldCheck size={20} /><small>{achievement.earnedAt ? `Earned ${new Date(achievement.earnedAt).toLocaleDateString('en-ZA')}` : 'Earned'}</small></div>
    </article>
  );
}

function BackendState({ title, message }) {
  return <section className="panel"><h2>{title}</h2><p>{message}</p></section>;
}
