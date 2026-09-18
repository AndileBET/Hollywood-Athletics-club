import { Medal } from 'lucide-react';

export default function AchievementBadge({ achievement }) {
  return (
    <article className="achievement-badge">
      <div className="achievement-topline">
        <div className="badge-icon">
          <Medal aria-hidden="true" size={19} />
        </div>
        <span>{achievement.tier}</span>
      </div>
      <h3>{achievement.title}</h3>
      <p>{achievement.description}</p>
      <div className="progress-track" aria-label={`${achievement.progress}% complete`}>
        <div style={{ width: `${achievement.progress}%` }} />
      </div>
    </article>
  );
}
