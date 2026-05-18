import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import OrderSummary from "../components/OrderSummary";

export default function CartPage({ cart, updateQuantity, cartCount, subtotal, shipping, total, formatPrice }) {
  const navigate = useNavigate();

  return (
    <section className="split-page">
      <div>
        <SectionHeader title="Shopping Cart" subtitle={`${cartCount} items selected`} />
        {cart.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add a few products from the shop page.</p>
          </div>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <article key={item._id} className="cart-row">
                <img src={item.image} alt={item.name} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatPrice(item.price)}</span>
                </div>
                <div className="quantity-control">
                  <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <OrderSummary
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        formatPrice={formatPrice}
        buttonLabel="Checkout"
        onButton={() => navigate("/checkout")}
        disabled={cart.length === 0}
      />
    </section>
  );
}
