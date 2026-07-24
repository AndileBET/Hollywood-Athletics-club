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

const currentBenefits = [
  '10% discount on merchandise',
  'Quarterly training plans',
  'Priority event registration',
  'Exclusive group runs',
];

const tiers = [
  {
    name: 'Bronze',
    range: '0 - 999 points',
    tone: 'bronze',
    benefits: ['5% discount on merchandise', 'Access to community forum', 'Monthly newsletter'],
  },
  {
    name: 'Silver',
    range: '1000 - 2499 points',
    tone: 'silver',
    active: true,
    benefits: ['10% discount on merchandise', 'Priority event registration', 'Quarterly training plans', '+1 more...'],
  },
  {
    name: 'Gold',
    range: '2500 - 4999 points',
    tone: 'gold',
    benefits: ['15% discount on merchandise', 'VIP event access', 'Personal coach consultation', '+2 more...'],
  },
  {
    name: 'Platinum',
    range: '5000+ points',
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
    points: 400,
    progress: 40,
    current: 12,
    target: 30,
    icon: Flame,
  },
  {
    title: 'Distance King',
    description: 'Run 500km total',
    points: 600,
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
    earned: 'Earned 2025/11/20',
    icon: Trophy,
  },
  {
    title: 'Marathon Ready',
    description: 'Complete a 42km run',
    points: 1000,
    earned: 'Earned 2025/10/15',
    icon: Medal,
  },
  {
    title: 'Speed Demon',
    description: 'Run 5km under 20 minutes',
    points: 300,
    earned: 'Earned 2025/09/08',
    icon: Zap,
  },
];

export default function Rewards() {
  return (
    <div className="rewards-page">
      <header className="rewards-title">
        <h2>Rewards &amp; Achievements</h2>
        <p>Track your progress and unlock exclusive benefits</p>
      </header>

      <section className="rewards-level-card" aria-label="Current rewards level">
        <div className="rewards-level-top">
          <div className="rewards-level-heading">
            <span className="rewards-star">
              <Star aria-hidden="true" size={19} />
            </span>
            <h3>Ambassador Level: Silver</h3>
          </div>
          <span className="rewards-points-badge">2450 Points</span>
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
            <strong>Progress to Gold</strong>
            <span>2450 / 2500 points</span>
          </div>
          <ProgressBar value={98} />
          <p>50 points until Gold level</p>
        </div>
      </section>

      <section className="rewards-panel">
        <h3>Ambassador Tiers</h3>
        <div className="tier-grid">
          {tiers.map((tier) => (
            <article className={`tier-card ${tier.tone} ${tier.active ? 'is-active' : ''}`} key={tier.name}>
              <div className="tier-card-heading">
                <Award aria-hidden="true" size={31} />
                <div>
                  <h4>{tier.name}</h4>
                  <p>{tier.range}</p>
                </div>
                {tier.active && <span>Active</span>}
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
        <h3>In Progress</h3>
        <div className="achievement-progress-grid">
          {inProgressAchievements.map((achievement) => (
            <ProgressAchievement achievement={achievement} key={achievement.title} />
          ))}
        </div>
      </section>

      <section className="rewards-panel">
        <h3>Earned Achievements (3)</h3>
        <div className="earned-grid">
          {earnedAchievements.map((achievement) => (
            <EarnedAchievement achievement={achievement} key={achievement.title} />
          ))}
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
        <small>{achievement.earned}</small>
      </div>
    </article>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="rewards-progress-track" aria-hidden="true">
      <div style={{ width: `${value}%` }} />
    </div>
  );
}
