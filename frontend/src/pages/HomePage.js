import ProductCard from "../component/ProductCard";
import SectionHeader from "../components/SectionHeader";
import ProductCarousel from "../components/ProductCarousel";
import CategoryCards from "../components/CategoryCards";
import TrustBadges from "../components/TrustBadges";
import TestimonialGrid from "../components/TestimonialGrid";

export default function HomePage({
  products,
  categories,
  query,
  setQuery,
  category,
  setCategory,
  homeCarouselProducts,
  trendingProducts,
  addToCart,
  wishlist,
  toggleWishlist,
  loading,
}) {
  return (
    <>
      <section className="home-search-panel home-search-topnote">
        <div className="home-search-copy">
          <span className="eyebrow">Shop search</span>
          <h2>Search products instantly and keep the catalog in view.</h2>
        </div>
        <div className="header-search">
          <input
            type="search"
            placeholder="Search products, brands or categories"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" onClick={() => setQuery("")}>Clear</button>
        </div>
      </section>
      <SectionHeader title="Shop by category" subtitle="A quick way to filter your favorites." />
      <CategoryCards categories={categories} setCategory={setCategory} />
      <TrustBadges />
      <SectionHeader
        title="Catalog highlights"
        subtitle="Automatic product slideshow with top-rated picks."
        action="Browse catalog"
        onAction={() => setCategory("All")}
      />
      <ProductCarousel products={homeCarouselProducts} onAdd={addToCart} />
      <SectionHeader title="Trending now" subtitle="Popular picks to inspire your next order." action="Browse all" onAction={() => setCategory("All")} />
      <div className="product-grid">
        {trendingProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAdd={addToCart}
            onToggleWishlist={toggleWishlist}
            isSaved={wishlist.includes(product._id)}
          />
        ))}
      </div>
      <TestimonialGrid />
    </>
  );
}
