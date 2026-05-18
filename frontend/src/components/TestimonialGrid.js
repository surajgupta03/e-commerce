export default function TestimonialGrid() {
  const testimonials = [
    {
      quote: "Nexa Store made it easy to discover products I actually wanted. The fast checkout and curated categories feel premium.",
      author: "— Ananya, New Delhi",
    },
    {
      quote: "I love the auto-play product showcase and quick add flow—this is a beautiful, high-quality shopping homepage.",
      author: "— Vikram, Mumbai",
    },
  ];

  return (
    <section className="testimonial-grid">
      {testimonials.map((item) => (
        <article key={item.author} className="testimonial-card">
          <span className="eyebrow">Customer review</span>
          <p>{item.quote}</p>
          <strong>{item.author}</strong>
        </article>
      ))}
    </section>
  );
}
