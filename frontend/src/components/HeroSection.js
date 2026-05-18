import { useNavigate } from "react-router-dom";

export default function HeroSection({ productCount, categories, averageRating, heroProduct }) {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">Curated marketplace</span>
        <h1>Shop smarter with a store that feels alive.</h1>
        <p>
          Discover polished essentials across tech, fashion, home, beauty, and travel with quick filters,
          wishlist saves, and a premium checkout experience.
        </p>
        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={() => navigate("/shop")}>Start shopping</button>
          <button type="button" className="secondary-button" onClick={() => navigate("/support")}>Store support</button>
        </div>
        <div className="stats-strip">
          <span>
            <strong>{productCount}+</strong>
            Products
          </span>
          <span>
            <strong>{Math.max(categories.length - 1, 0)}</strong>
            Categories
          </span>
          <span>
            <strong>{averageRating}</strong>
            Avg rating
          </span>
        </div>
      </div>
      {heroProduct && (
        <button className="hero-product" type="button" onClick={() => navigate(`/product/${heroProduct._id}`)}>
          <img src={heroProduct.image} alt={heroProduct.name} />
          <div>
            <span>{heroProduct.category}</span>
            <h2>{heroProduct.name}</h2>
            <strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(heroProduct.price || 0))}</strong>
          </div>
        </button>
      )}
    </section>
  );
}
