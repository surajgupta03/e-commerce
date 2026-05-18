import ProductCard from "../component/ProductCard";
import SectionHeader from "../components/SectionHeader";

export default function ShopPage({
  visibleProducts,
  categories,
  category,
  setCategory,
  sort,
  setSort,
  query,
  setQuery,
  addToCart,
  wishlist,
  toggleWishlist,
  loading,
}) {
  return (
    <>
      <SectionHeader
        title="Shop Catalog"
        subtitle={loading ? "Refreshing products..." : `${visibleProducts.length} products ready`}
      />
      <section className="shop-toolbar">
        <label>
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
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
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-low">Price low to high</option>
            <option value="price-high">Price high to low</option>
          </select>
        </label>
      </section>
      <div className="category-pills">
        {categories.map((item) => (
          <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => (
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
