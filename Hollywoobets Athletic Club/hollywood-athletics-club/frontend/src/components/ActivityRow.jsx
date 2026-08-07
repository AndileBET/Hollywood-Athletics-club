import { Activity, Mountain, Timer } from 'lucide-react';

export default function ActivityRow({ activity, compact = false }) {
  return (
    <article className={`activity-row ${compact ? 'is-compact' : ''}`}>
      <div className="activity-main">
        <div className="activity-type">
          <Activity aria-hidden="true" size={19} />
        </div>
        <div>
          <h3>{activity.name}</h3>
          <p>{activity.date} · {activity.type}</p>
        </div>
      </div>

      <div className="activity-metrics">
        <span>{activity.distance} km</span>
        <span><Timer aria-hidden="true" size={15} />{activity.duration}</span>
        {!compact ? <span>{activity.pace}</span> : null}
        {!compact ? <span><Mountain aria-hidden="true" size={15} />{activity.elevation}</span> : null}
        <strong>+{activity.points} pts</strong>
      </div>
    </article>
  );
}
