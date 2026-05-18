import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import OrderSummary from "../components/OrderSummary";

export default function CheckoutPage({ cart, customer, setCustomer, handleCheckout, total, subtotal, shipping, formatPrice }) {
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    if (cart.length === 0) return;
    handleCheckout();
    navigate("/account");
  }

  return (
    <section className="split-page">
      <form className="checkout-form" onSubmit={onSubmit}>
        <SectionHeader title="Checkout" subtitle="Add delivery details to place your order." />
        {['name', 'email', 'phone', 'address', 'city'].map((field) => (
          <label key={field}>
            <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
            <input
              required
              value={customer[field] || ""}
              onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
              placeholder={`Enter ${field}`}
              type={field === "email" ? "email" : "text"}
            />
          </label>
        ))}
        <label>
          <span>Payment method</span>
          <select value={customer.payment} onChange={(event) => setCustomer({ ...customer, payment: event.target.value })}>
            <option>UPI</option>
            <option>Card</option>
            <option>Wallet</option>
            <option>Cash on delivery</option>
          </select>
        </label>
        <button className="primary-button submit-button" type="submit" disabled={cart.length === 0}>
          Place order
        </button>
      </form>
      <OrderSummary subtotal={subtotal} shipping={shipping} total={total} formatPrice={formatPrice} />
    </section>
  );
}
