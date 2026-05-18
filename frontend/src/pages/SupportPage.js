import SectionHeader from "../components/SectionHeader";

export default function SupportPage() {
  return (
    <>
      <SectionHeader title="Support" subtitle="Help content, service promises, and store policies." />
      <section className="support-grid">
        {[
          ["Shipping", "Free shipping on orders over ₹5,000 with live totals in the cart."],
          ["Returns", "Simple seven-day replacement flow for damaged or incorrect items."],
          ["Payments", "UPI, cards, wallets, and cash on delivery are represented in checkout."],
          ["Business", "Admin product and order endpoints can be expanded into a full dashboard."],
        ].map(([title, copy]) => (
          <article key={title} className="feature-card">
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </>
  );
}
