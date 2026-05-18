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
