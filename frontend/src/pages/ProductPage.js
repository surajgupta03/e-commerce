import { useMemo } from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import ProductCard from "../component/ProductCard";

export default function ProductPage({ products, addToCart, wishlist, toggleWishlist }) {
  const { id } = useParams();
  const selectedProduct = useMemo(
    () => products.find((product) => product._id === id) || products[0],
    [id, products]
  );

  if (!selectedProduct) {
    return (
      <SectionHeader title="Product not found" subtitle="Try browsing the catalog again." />
    );
  }

  const related = products.filter((product) => product.category === selectedProduct.category && product._id !== selectedProduct._id).slice(0, 3);

  return (
    <>
      <section className="product-detail">
        <div className="detail-image-wrap">
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{selectedProduct.category}</span>
          <h1>{selectedProduct.name}</h1>
          <p>{selectedProduct.description}</p>
          <div className="detail-price-row">
            <strong>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(selectedProduct.price || 0))}</strong>
            <span>{selectedProduct.stock || 0} in stock</span>
            <span>{Number(selectedProduct.rating || 0).toFixed(1)} rating</span>
          </div>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => addToCart(selectedProduct)}>
              Add to cart
            </button>
            <button type="button" className="secondary-button" onClick={() => toggleWishlist(selectedProduct._id)}>
              {wishlist.includes(selectedProduct._id) ? "Saved" : "Save item"}
            </button>
          </div>
          <div className="info-grid">
            <article>
              <strong>Secure payments</strong>
              <p>UPI, card, wallet, and cash on delivery ready.</p>
            </article>
            <article>
              <strong>Easy returns</strong>
              <p>Seven-day replacement window on eligible products.</p>
            </article>
          </div>
        </div>
      </section>
      <SectionHeader title="Similar Picks" />
      <div className="product-grid compact-grid">
        {(related.length ? related : products.slice(0, 3)).map((product) => (
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
  );
}
