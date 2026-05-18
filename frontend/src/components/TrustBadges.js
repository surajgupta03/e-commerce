const trustHighlights = [
  {
    title: "Free shipping",
    detail: "Fast delivery on orders above ₹5,000.",
  },
  {
    title: "Secure checkout",
    detail: "Encrypted payments and trusted transactions.",
  },
  {
    title: "24/7 support",
    detail: "Live help and easy returns included.",
  },
];

export default function TrustBadges() {
  return (
    <section className="trust-badges">
      {trustHighlights.map((item) => (
        <article key={item.title} className="trust-badge">
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
        </article>
      ))}
    </section>
  );
}
