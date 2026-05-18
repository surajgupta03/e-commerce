export default function CategoryCards({ categories, setCategory }) {
  const visibleCategories = categories.filter((category) => category !== "All").slice(0, 4);

  return (
    <div className="category-highlight-grid">
      {visibleCategories.map((item) => (
        <button key={item} type="button" className="category-card" onClick={() => setCategory(item)}>
          <span>{item.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{item}</strong>
            <p>Explore curated products</p>
          </div>
        </button>
      ))}
    </div>
  );
}
