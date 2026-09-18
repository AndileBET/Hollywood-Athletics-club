export default function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        <Icon aria-hidden="true" size={21} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {detail ? <span>{detail}</span> : null}
      </div>
    </article>
  );
}
