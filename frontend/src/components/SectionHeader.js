export default function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="section-header">
      <div>
        <span className="eyebrow">Nexa Store</span>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && (
        <button type="button" className="secondary-button" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
