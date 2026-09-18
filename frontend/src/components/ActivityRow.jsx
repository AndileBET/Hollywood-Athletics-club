import { Clock3, Footprints, Gauge, Star } from 'lucide-react';

export default function ActivityRow({ activity, compact = false, hideDistance = false }) {
  const type = activity.type || 'Activity';
  return (
    <article className={`activity-row ${compact ? 'is-compact' : ''}`}>
      <div className="activity-main">
        <div className="activity-type"><Footprints aria-hidden="true" size={17} /></div>
        <div>
          <h3>{activity.name}</h3>
          <p>{activity.date} · {type}</p>
        </div>
      </div>
      <div className="activity-metrics">
        {!hideDistance ? (
  <span className="activity-distance">
    <Gauge size={13} />
    {activity.distance.toFixed(1)}
    <img src="/images/branding/stars.png" alt="" className="km-star-icon" />
  </span>
) : null}
        {activity.duration ? <span><Clock3 size={13} /> {activity.duration}</span> : null}
        {activity.points != null ? <strong><Star size={13} fill="currentColor" /> {activity.points} pts</strong> : null}
      </div>
    </article>
  );
}
