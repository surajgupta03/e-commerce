import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import ProductCard from "../component/ProductCard";

export default function AccountPage({ wishlist, products, customer, order, addToCart, toggleWishlist }) {
  const navigate = useNavigate();
  const savedProducts = products.filter((product) => wishlist.includes(product._id));

  return (
    <>
      <SectionHeader title="Account" subtitle="A modern customer hub for orders and saved items." />
      <section className="account-grid">
        <article className="profile-card">
          <span className="eyebrow">Customer</span>
          <h2>{customer.name || "Guest shopper"}</h2>
          <p>{customer.email || "Sign in flow can be connected to your backend user routes."}</p>
          {order && (
            <div className="last-order">
              <span>Latest order</span>
              <strong>{order.number}</strong>
              <small>{order.date} · {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(order.total || 0))}</small>
            </div>
          )}
        </article>
        <article className="profile-card light">
          <span className="eyebrow">Wishlist</span>
          <h2>{savedProducts.length} saved items</h2>
          <p>Items you save on product cards appear here automatically.</p>
          <button type="button" className="secondary-button" onClick={() => navigate("/shop")}>Keep browsing</button>
        </article>
      </section>
      {savedProducts.length > 0 && (
        <div className="product-grid compact-grid">
          {savedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAdd={addToCart}
              onToggleWishlist={toggleWishlist}
              isSaved={wishlist.includes(product._id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
