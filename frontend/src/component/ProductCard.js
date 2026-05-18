import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd, onToggleWishlist, isSaved = false }) {
  const ratingStars = "★".repeat(Math.round(product.rating || 0));

  return (
    <article className="product-card">
      <button className="wishlist-button" type="button" onClick={() => onToggleWishlist(product._id)}>
        {isSaved ? "Saved" : "Save"}
      </button>
      <Link className="product-media" to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} />
        <span>{product.badge || "Featured"}</span>
      </Link>
      <div className="product-copy">
        <div className="product-meta">
          <span>{product.category}</span>
          <strong>{Number(product.rating || 0).toFixed(1)}</strong>
        </div>
        <h3>{product.name}</h3>
        <div className="rating-row">
          <span>{ratingStars}</span>
          <span>{Number(product.rating || 0).toFixed(1)}</span>
        </div>
        <p>{product.description}</p>
        <div className="product-footer">
          <div>
            <strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(product.price || 0))}</strong>
            <small>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</small>
          </div>
          <button type="button" className="primary-button small" onClick={() => onAdd(product)}>
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

