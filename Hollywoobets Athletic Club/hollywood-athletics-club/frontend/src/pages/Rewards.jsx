import {
  Award,
  CheckCircle2,
  Flame,
  Medal,
  Moon,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRewardsData } from '../api/client.js';

const currentBenefits = [
  '10% discount on merchandise',
  'Quarterly training plans',
  'Priority event registration',
  'Exclusive group runs',
];

const tiers = [
  {
    name: 'Bronze',
    range: '0 - 200 points',
    tone: 'bronze',
    benefits: ['5% discount on merchandise', 'Access to community forum', 'Monthly newsletter'],
  },
  {
    name: 'Silver',
    range: '200 - 400 points',
    tone: 'silver',
    benefits: ['10% discount on merchandise', 'Priority event registration', 'Quarterly training plans', '+1 more...'],
  },
  {
    name: 'Gold',
    range: '500 - 800 points',
    tone: 'gold',
    benefits: ['15% discount on merchandise', 'VIP event access', 'Personal coach consultation', '+2 more...'],
  },
  {
    name: 'Platinum',
    range: '800 - 1,000 points',
    tone: 'platinum',
    benefits: ['20% discount on merchandise', 'All Gold benefits', 'Exclusive merchandise', '+2 more...'],
  },
];

const inProgressAchievements = [
  {
    title: 'Early Bird',
    description: 'Complete 50 runs before 7am',
    points: 250,
    progress: 76,
    current: 38,
    target: 50,
    icon: Moon,
  },
  {
    title: 'Iron Will',
    description: 'Maintain a 30-day streak',
    points: 300,
    progress: 40,
    current: 12,
    target: 30,
    icon: Flame,
  },
  {
    title: 'Distance King',
    description: 'Run 500km total',
    points: 500,
    progress: 97,
    current: 487,
    target: 500,
    icon: Target,
  },
];

const earnedAchievements = [
  {
    title: 'Century Club',
    description: 'Complete 100 runs',
    points: 500,
    earned: 'Earned 2026/05/20',
    icon: Trophy,
  },
  {
    title: 'Marathon Ready',
    description: 'Complete a 42km run',
    points: 1000,
    earned: 'Earned 2026/03/15',
    icon: Medal,
  },
  {
    title: 'Speed Demon',
    description: 'Run 5km under 20 minutes',
    points: 300,
    earned: 'Earned 2026/02/08',
    icon: Zap,
  },
];

const achievementIcons = { flame: Flame, moon: Moon, target: Target, zap: Zap };

export default function Rewards() {
  const [rewardsData, setRewardsData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    getRewardsData()
      .then((data) => mounted && setRewardsData(data))
      .catch((error) => mounted && setErrorMessage(error.message));
    return () => { mounted = false; };
  }, []);

  if (errorMessage) {
    return <BackendState title="Rewards unavailable" message={errorMessage} />;
  }

  if (!rewardsData) {
    return <BackendState title="Loading rewards" message="Calculating your latest points and achievements..." />;
  }

  const normalizeAchievement = (achievement) => ({
    ...achievement,
    icon: achievementIcons[achievement.icon] || Medal,
  });
  const inProgressAchievements = rewardsData.inProgressAchievements.map(normalizeAchievement);
  const earnedAchievements = rewardsData.earnedAchievements.map(normalizeAchievement);
  const activeTier = tiers.find((candidate) => candidate.name === rewardsData.tier.name) || tiers[0];
  const currentBenefits = activeTier.benefits;
  const { tier, totalPoints } = rewardsData;

  return (
    <div className="rewards-page">
      <header className="rewards-title">
        <p className="eyebrow">Member Rewards</p>
        <h2>Chase your <span className="headline-highlight yellow">next</span> milestone</h2>
        <p>Track points, unlock benefits, and celebrate achievements that reward consistency, wellness, and community participation.</p>
      </header>

      <section className="rewards-level-card" aria-label="Current rewards level">
        <div className="rewards-level-top">
          <div className="rewards-level-heading">
            <span className="rewards-star">
              <Star aria-hidden="true" size={19} />
            </span>
            <h3>Ambassador Level: {tier.name}</h3>
          </div>
          <span className="rewards-points-badge">{totalPoints.toLocaleString()} Points</span>
        </div>

        <div className="benefits-block">
          <h4>Current Benefits:</h4>
          <div className="benefits-grid">
            {currentBenefits.map((benefit) => (
              <span key={benefit}>
                <CheckCircle2 aria-hidden="true" size={15} />
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="tier-progress">
          <div>
            <strong>{tier.nextName ? `Progress to ${tier.nextName}` : 'Highest ambassador tier reached'}</strong>
            <span>{totalPoints.toLocaleString()}{tier.nextAt ? ` / ${tier.nextAt.toLocaleString()} points` : ' points'}</span>
          </div>
          <ProgressBar value={tier.progress} />
          <p>{tier.nextName ? `${tier.pointsToNext.toLocaleString()} points until ${tier.nextName} level` : 'You have reached Platinum level'}</p>
        </div>
      </section>

      <section className="rewards-panel">
        <h3>Ambassador Tiers</h3>
        <div className="tier-grid">
          {tiers.map((tier) => (
            <article className={`tier-card ${tier.tone} ${tier.name === rewardsData.tier.name ? 'is-active' : ''}`} key={tier.name}>
              <div className="tier-card-heading">
                <Award aria-hidden="true" size={31} />
                <div>
                  <h4>{tier.name}</h4>
                  <p>{tier.range}</p>
                </div>
                {tier.name === rewardsData.tier.name && <span>Active</span>}
              </div>
              <ul>
                {tier.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rewards-panel">
        <h3>In Progress ({inProgressAchievements.length})</h3>
        <div className="achievement-progress-grid">
          {inProgressAchievements.map((achievement) => (
            <ProgressAchievement achievement={achievement} key={achievement.title} />
          ))}
        </div>
      </section>

      <section className="rewards-panel">
        <h3>Earned Achievements ({earnedAchievements.length})</h3>
        <div className="earned-grid">
          {earnedAchievements.length ? earnedAchievements.map((achievement) => (
            <EarnedAchievement achievement={achievement} key={achievement.title} />
          )) : <p>No achievements earned yet. Your next synced activity may change that.</p>}
        </div>
      </section>
    </div>
  );
}

function ProgressAchievement({ achievement }) {
  const Icon = achievement.icon;

  return (
    <article className="achievement-progress-card">
      <div className="achievement-card-top">
        <span className="achievement-icon blue">
          <Icon aria-hidden="true" size={20} />
        </span>
        <div>
          <h4>{achievement.title}</h4>
          <p>{achievement.description}</p>
        </div>
      </div>
      <div className="achievement-progress-meta">
        <span>Progress</span>
        <strong>
          {achievement.current}/{achievement.target}
        </strong>
      </div>
      <ProgressBar value={achievement.progress} />
      <div className="achievement-card-bottom">
        <span>{achievement.points} pts</span>
        <small>{achievement.progress}% complete</small>
      </div>
    </article>
  );
}

function EarnedAchievement({ achievement }) {
  const Icon = achievement.icon;

  return (
    <article className="earned-card">
      <span className="achievement-icon green">
        <Icon aria-hidden="true" size={21} />
      </span>
      <div>
        <h4>{achievement.title}</h4>
        <p>{achievement.description}</p>
        <span>{achievement.points} pts</span>
      </div>
      <div className="earned-status">
        <ShieldCheck aria-hidden="true" size={20} />
        <small>{achievement.earnedAt ? `Earned ${new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium' }).format(new Date(achievement.earnedAt))}` : 'Earned'}</small>
      </div>
    </article>
  );
}

function BackendState({ title, message }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="rewards-progress-track" aria-hidden="true">
      <div style={{ width: `${value}%` }} />
    </div>
  );
}
