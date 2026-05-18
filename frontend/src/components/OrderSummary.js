export default function OrderSummary({ subtotal, shipping, total, formatPrice, buttonLabel, onButton, disabled }) {
  return (
    <aside className="summary-panel">
      <span className="eyebrow">Order Summary</span>
      <h2>{formatPrice(total)}</h2>
      <div className="summary-line">
        <span>Subtotal</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      <div className="summary-line">
        <span>Shipping</span>
        <strong>{shipping === 0 ? "Free" : formatPrice(shipping)}</strong>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <p>
        {subtotal >= 5000
          ? "Free shipping unlocked."
          : `${formatPrice(5000 - subtotal)} away from free shipping.`}
      </p>
      {buttonLabel && (
        <button type="button" className="primary-button submit-button" onClick={onButton} disabled={disabled}>
          {buttonLabel}
        </button>
      )}
    </aside>
  );
}
