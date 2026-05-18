import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import ProductCard from "../component/ProductCard";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function expectedDeliveryDate(order) {
  const baseDate = order.createdAt ? new Date(order.createdAt) : new Date();
  baseDate.setDate(baseDate.getDate() + 5);
  return formatDate(baseDate);
}

export default function AccountPage({ wishlist, products, customer, setCustomer, orders, ordersLoading, order, addToCart, toggleWishlist, formatPrice }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const savedProducts = products.filter((product) => wishlist.includes(product._id));

  const profileItems = useMemo(
    () => [
      { label: "Name", value: customer.name },
      { label: "Email", value: customer.email },
      { label: "Phone", value: customer.phone },
    ],
    [customer]
  );

  const currentOrders = orders || [];

  return (
    <>
      <SectionHeader title="Account" subtitle="A modern customer hub for orders, profile, and address details." />

      <section className="account-tabs">
        {[
          { key: "orders", label: "Orders" },
          { key: "profile", label: "Profile" },
          { key: "address", label: "Address" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? "secondary-button active-tab" : "secondary-button"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {activeTab === "orders" && (
        <section className="order-list">
          {ordersLoading ? (
            <div className="empty-state">
              <h3>Loading orders...</h3>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No orders yet</h3>
              <p>Place your first order to see delivery status, estimated date and order history.</p>
              <button type="button" className="primary-button" onClick={() => navigate("/shop")}>Start shopping</button>
            </div>
          ) : (
            currentOrders.map((item) => (
              <article key={item._id || item.orderNumber} className="profile-card order-card">
                <div className="order-meta">
                  <div>
                    <span className="eyebrow">Order</span>
                    <h2>{item.orderNumber || item.number}</h2>
                    <small>{formatDate(item.createdAt || item.date || new Date())}</small>
                  </div>
                  <div className="order-status">
                    <small>{item.status || "Pending"}</small>
                  </div>
                </div>
                <div className="order-summary-row">
                  <div>
                    <strong>{item.items?.length || 0} items</strong>
                    <p>{formatPrice(item.total || 0)}</p>
                  </div>
                  <div>
                    <strong>Expected delivery</strong>
                    <p>{expectedDeliveryDate(item)}</p>
                  </div>
                </div>
                <div className="order-shipping">
                  <span className="eyebrow">Delivery address</span>
                  <p>{item.shippingAddress?.address || "Not available"}</p>
                  <p>
                    {item.shippingAddress?.city || ""}
                    {item.shippingAddress?.city ? ", " : ""}
                    {item.shippingAddress?.state || ""} {item.shippingAddress?.zip || ""}
                  </p>
                  <p>{item.shippingAddress?.country || ""}</p>
                </div>
                <div className="order-items-grid">
                  {(item.items || []).map((product) => (
                    <div key={product.productId || product._id || product.name} className="order-item-card">
                      <strong>{product.name}</strong>
                      <span>{product.quantity} × {formatPrice(product.price)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {activeTab === "profile" && (
        <section className="account-grid">
          <article className="profile-card">
            <span className="eyebrow">Customer</span>
            <h2>{customer.name || "Guest shopper"}</h2>
            <p>{customer.email || "Sign in to save your profile details."}</p>
            {profileItems.map((item) => (
              <p key={item.label}>
                <strong>{item.label}: </strong>
                {item.value || "Not set"}
              </p>
            ))}
          </article>
          <article className="profile-card light">
            <span className="eyebrow">Latest order</span>
            {order ? (
              <>
                <h2>{order.orderNumber || order.number}</h2>
                <p>Status: {order.status || "Confirmed"}</p>
                <p>{formatPrice(order.total || 0)}</p>
              </>
            ) : (
              <p>No recent order available.</p>
            )}
          </article>
        </section>
      )}

      {activeTab === "address" && (
        <section className="checkout-form profile-form">
          <SectionHeader title="Address details" subtitle="Update your delivery address and contact information." />
          {[
            { field: "address", label: "Street address" },
            { field: "city", label: "City" },
            { field: "state", label: "State" },
            { field: "zip", label: "ZIP code" },
            { field: "country", label: "Country" },
          ].map(({ field, label }) => (
            <label key={field}>
              <span>{label}</span>
              <input
                value={customer[field] || ""}
                onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                placeholder={label}
                type="text"
              />
            </label>
          ))}
          <button type="button" className="primary-button" onClick={() => alert("Address saved locally.")}>Save address</button>
        </section>
      )}

      {savedProducts.length > 0 && (
        <>
          <SectionHeader title="Saved items" subtitle="These products are waiting in your wishlist." />
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
        </>
      )}
    </>
  );
}
