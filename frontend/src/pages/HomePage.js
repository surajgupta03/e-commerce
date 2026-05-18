import ProductCard from "../component/ProductCard";
import SectionHeader from "../components/SectionHeader";
import HeroSection from "../components/HeroSection";
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
  featuredProducts,
  homeCarouselProducts,
  trendingProducts,
  addToCart,
  wishlist,
  toggleWishlist,
  loading,
}) {
  const heroProduct = featuredProducts[0] || products[0];
  const averageRating = products.length
    ? (products.reduce((sum, product) => sum + Number(product.rating || 0), 0) / products.length).toFixed(1)
    : "0.0";

  return (
    <>
      <HeroSection
        productCount={products.length}
        categories={categories}
        averageRating={averageRating}
        heroProduct={heroProduct}
      />
      <section className="home-search-panel">
        <div className="home-search-copy">
          <span className="eyebrow">Discover quickly</span>
          <h2>Search products or explore categories in one tap.</h2>
        </div>
        <div className="search-panel-controls">
          <label>
            <span>Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands, or features"
            />
          </label>
          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
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
