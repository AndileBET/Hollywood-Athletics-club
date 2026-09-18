export default function StridesBrand({ compact = false }) {
  return (
    <div className={`strides-brand ${compact ? 'is-compact' : ''}`}>
      <img src="/images/branding/strides.png" alt="STRIDES" className="strides-logo" />
    </div>
  );
}
