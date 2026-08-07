export default function ChartCard({ title, subtitle, children }) {
  return (
    <section className="chart-card">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="chart-area">{children}</div>
    </section>
  );
}
