import { Construction, Sparkles } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <section className="coming-soon">
      <div className="coming-icon">
        <Construction aria-hidden="true" size={30} />
      </div>
      <p className="eyebrow">Coming Soon</p>
      <h2>{title}</h2>
      <p>
        This area is being shaped for club members with polished rewards, live
        participation, and premium partner experiences.
      </p>
      <div className="preview-pill">
        <Sparkles aria-hidden="true" size={16} />
        <span>Designed for a future Strava-powered release</span>
      </div>
    </section>
  );
}
