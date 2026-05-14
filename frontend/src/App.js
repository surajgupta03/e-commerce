import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(
  /\/$/,
  ""
);

const fallbackProducts = [
  {
    _id: "p1",
    name: "Pulse Smartwatch",
    category: "Electronics",
    price: 13999,
    stock: 8,
    rating: 4.6,
    description: "AMOLED fitness watch with sleep tracking, notifications, and a week-long battery.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    badge: "Best seller",
  },
  {
    _id: "p2",
    name: "Studio Wireless Headphones",
    category: "Electronics",
    price: 10999,
    stock: 9,
    rating: 4.7,
    description: "Rich wireless sound with soft cushions and fast USB-C charging.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    badge: "New",
  },
  {
    _id: "p3",
    name: "Nova Tablet Pro",
    category: "Electronics",
    price: 22999,
    stock: 6,
    rating: 4.5,
    description: "Slim 2K tablet for streaming, sketching, reading, and work on the go.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    badge: "Limited",
  },
  {
    _id: "p4",
    name: "Luna Overshirt",
    category: "Fashion",
    price: 4999,
    stock: 20,
    rating: 4.5,
    description: "Relaxed brushed-cotton overshirt made for clean everyday layering.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    badge: "Editor pick",
  },
  {
    _id: "p5",
    name: "Harbor Linen Shirt",
    category: "Fashion",
    price: 3899,
    stock: 18,
    rating: 4.4,
    description: "Breathable linen blend with a crisp collar and an easy warm-weather fit.",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
    badge: "Lightweight",
  },
  {
    _id: "p6",
    name: "Aether Running Shoes",
    category: "Footwear",
    price: 7499,
    stock: 14,
    rating: 4.8,
    description: "Responsive knit runners built for daily miles and all-day comfort.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    badge: "Top rated",
  },
  {
    _id: "p7",
    name: "Terrain Trek Boots",
    category: "Footwear",
    price: 8999,
    stock: 7,
    rating: 4.7,
    description: "Rugged ankle boots with grippy soles and a weather-ready finish.",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    badge: "Adventure",
  },
  {
    _id: "p8",
    name: "Summit Travel Backpack",
    category: "Accessories",
    price: 6299,
    stock: 11,
    rating: 4.7,
    description: "Organized 28L backpack with a laptop sleeve and reinforced base.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    badge: "Travel ready",
  },
  {
    _id: "p9",
    name: "Harbor Sunglasses",
    category: "Accessories",
    price: 2999,
    stock: 18,
    rating: 4.4,
    description: "Square polarized sunglasses with lightweight frames and UV400 lenses.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    badge: "Polarized",
  },
  {
    _id: "p10",
    name: "Ceramic Brew Set",
    category: "Home",
    price: 3499,
    stock: 16,
    rating: 4.9,
    description: "Minimal pour-over kit with a matte ceramic dripper, server, and mugs.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    badge: "Giftable",
  },
  {
    _id: "p11",
    name: "Cloud Lounge Chair",
    category: "Home",
    price: 16999,
    stock: 5,
    rating: 4.8,
    description: "Soft sculpted seating for reading corners, bedrooms, and compact lounges.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    badge: "Premium",
  },
  {
    _id: "p12",
    name: "Botanical Face Serum",
    category: "Beauty",
    price: 1899,
    stock: 28,
    rating: 4.7,
    description: "Light daily serum with a dewy finish designed for hydration and glow.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    badge: "Clean beauty",
  },
];

const navItems = [
  { label: "Home", route: "home" },
  { label: "Shop", route: "shop" },
  { label: "Cart", route: "cart" },
  { label: "Account", route: "account" },
  { label: "Support", route: "support" },
];

const shippingFee = 149;
const freeShippingThreshold = 5000;

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function getRouteFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [page = "home", id = ""] = raw.split("/");
  return { page: page || "home", id };
}

function navigate(page, id = "") {
  window.location.hash = id ? `#/${page}/${id}` : `#/${page}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function App() {
  const [route, setRoute] = useState(() => getRouteFromHash());
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist-items")) || [];
    } catch {
      return [];
    }
  });
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart-items")) || [];
    } catch {
      return [];
    }
  });
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    payment: "UPI",
  });
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const syncRoute = () => setRoute(getRouteFromHash());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        const data = Array.isArray(response.data) ? response.data : response.data?.products;
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data.map((product) => ({ ...product, badge: product.badge || "Featured" })));
        }
      } catch {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist-items", JSON.stringify(wishlist));
  }, [wishlist]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category))).sort()],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
      const matchesQuery = text.includes(query.trim().toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesQuery && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
      return Number(b.rating || 0) - Number(a.rating || 0);
    });
  }, [category, products, query, sort]);

  const featuredProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 4),
    [products]
  );

  const selectedProduct = useMemo(
    () => products.find((product) => product._id === route.id) || products[0],
    [products, route.id]
  );

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shipping = cart.length === 0 || subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId, quantity) {
    setCart((current) =>
      current
        .map((item) => (item._id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleWishlist(productId) {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId]
    );
  }

  function handleCheckout(event) {
    event.preventDefault();
    if (cart.length === 0) return;

    setOrder({
      number: `NX-${Date.now().toString().slice(-6)}`,
      total,
      items: cart,
      customer,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setCart([]);
    navigate("account");
  }

  function ProductCard({ product }) {
    const saved = wishlist.includes(product._id);

    return (
      <article className="product-card">
        <button className="wishlist-button" type="button" onClick={() => toggleWishlist(product._id)}>
          {saved ? "Saved" : "Save"}
        </button>
        <button className="product-media" type="button" onClick={() => navigate("product", product._id)}>
          <img src={product.image} alt={product.name} />
          <span>{product.badge || "Featured"}</span>
        </button>
        <div className="product-copy">
          <div className="product-meta">
            <span>{product.category}</span>
            <strong>{Number(product.rating || 0).toFixed(1)}</strong>
          </div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <div className="product-footer">
            <strong>{formatPrice(product.price)}</strong>
            <button type="button" className="primary-button small" onClick={() => addToCart(product)}>
              Add
            </button>
          </div>
        </div>
      </article>
    );
  }

  function Header() {
    return (
      <header className="site-header">
        <a className="brand" href="#/home" onClick={() => navigate("home")}>
          <span>N</span>
          <div>
            <strong>Nexa Store</strong>
            <small>Modern essentials</small>
          </div>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.route}
              className={route.page === item.route ? "active" : ""}
              type="button"
              onClick={() => navigate(item.route)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="ghost-button" onClick={() => navigate("shop")}>
            Browse
          </button>
          <button type="button" className="cart-button" onClick={() => navigate("cart")}>
            Cart <span>{cartCount}</span>
          </button>
        </div>
      </header>
    );
  }

  function HomePage() {
    const heroProduct = featuredProducts[0] || products[0];

    return (
      <>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Curated marketplace</span>
            <h1>Shop smarter with a store that feels alive.</h1>
            <p>
              Discover polished essentials across tech, fashion, home, beauty, and travel with
              quick filters, wishlist saves, and a clean checkout flow.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => navigate("shop")}>
                Start shopping
              </button>
              <button type="button" className="secondary-button" onClick={() => navigate("support")}>
                Store support
              </button>
            </div>
            <div className="stats-strip">
              <span>
                <strong>{products.length}+</strong>
                Products
              </span>
              <span>
                <strong>{categories.length - 1}</strong>
                Categories
              </span>
              <span>
                <strong>4.7</strong>
                Avg rating
              </span>
            </div>
          </div>
          {heroProduct && (
            <button className="hero-product" type="button" onClick={() => navigate("product", heroProduct._id)}>
              <img src={heroProduct.image} alt={heroProduct.name} />
              <div>
                <span>{heroProduct.category}</span>
                <h2>{heroProduct.name}</h2>
                <strong>{formatPrice(heroProduct.price)}</strong>
              </div>
            </button>
          )}
        </section>

        <section className="feature-grid">
          {[
            ["Smart search", "Find products by name, category, or description."],
            ["Saved wishlist", "Collect products locally and return to them later."],
            ["Fast checkout", "Cart totals, free-shipping logic, and clean order summary."],
          ].map(([title, copy]) => (
            <article key={title} className="feature-card">
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <SectionHeader title="Featured Products" action="View all" onAction={() => navigate("shop")} />
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </>
    );
  }

  function ShopPage() {
    return (
      <>
        <SectionHeader
          title="Shop Catalog"
          subtitle={loading ? "Refreshing products..." : `${visibleProducts.length} products ready`}
        />
        <section className="shop-toolbar">
          <label>
            <span>Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
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
            <button
              key={item}
              className={category === item ? "active" : ""}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </>
    );
  }

  function ProductPage() {
    if (!selectedProduct) return <EmptyState title="Product not found" text="Try browsing the catalog again." />;

    const related = products
      .filter((product) => product.category === selectedProduct.category && product._id !== selectedProduct._id)
      .slice(0, 3);

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
              <strong>{formatPrice(selectedProduct.price)}</strong>
              <span>{selectedProduct.stock || 0} in stock</span>
              <span>{Number(selectedProduct.rating || 0).toFixed(1)} rating</span>
            </div>
            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => addToCart(selectedProduct)}>
                Add to cart
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => toggleWishlist(selectedProduct._id)}
              >
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
          {(related.length ? related : featuredProducts).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </>
    );
  }

  function CartPage() {
    return (
      <section className="split-page">
        <div>
          <SectionHeader title="Shopping Cart" subtitle={`${cartCount} items selected`} />
          {cart.length === 0 ? (
            <EmptyState title="Your cart is empty" text="Add a few products from the shop page." />
          ) : (
            <div className="cart-list">
              {cart.map((item) => (
                <article key={item._id} className="cart-row">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                  <div className="quantity-control">
                    <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <OrderSummary buttonLabel="Checkout" onButton={() => navigate("checkout")} disabled={cart.length === 0} />
      </section>
    );
  }

  function CheckoutPage() {
    return (
      <section className="split-page">
        <form className="checkout-form" onSubmit={handleCheckout}>
          <SectionHeader title="Checkout" subtitle="Add delivery details to place your order." />
          {["name", "email", "phone", "address", "city"].map((field) => (
            <label key={field}>
              <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
              <input
                required
                value={customer[field]}
                onChange={(event) => setCustomer({ ...customer, [field]: event.target.value })}
                placeholder={`Enter ${field}`}
                type={field === "email" ? "email" : "text"}
              />
            </label>
          ))}
          <label>
            <span>Payment method</span>
            <select
              value={customer.payment}
              onChange={(event) => setCustomer({ ...customer, payment: event.target.value })}
            >
              <option>UPI</option>
              <option>Card</option>
              <option>Wallet</option>
              <option>Cash on delivery</option>
            </select>
          </label>
          <button className="primary-button submit-button" type="submit" disabled={cart.length === 0}>
            Place order
          </button>
        </form>
        <OrderSummary />
      </section>
    );
  }

  function AccountPage() {
    const savedProducts = products.filter((product) => wishlist.includes(product._id));

    return (
      <>
        <SectionHeader title="Account" subtitle="A modern customer hub for orders and saved items." />
        <section className="account-grid">
          <article className="profile-card">
            <span className="eyebrow">Customer</span>
            <h2>{customer.name || "Guest shopper"}</h2>
            <p>{customer.email || "Sign in flow can be connected to your backend user routes."}</p>
            {order && (
              <div className="last-order">
                <span>Latest order</span>
                <strong>{order.number}</strong>
                <small>{formatPrice(order.total)} on {order.date}</small>
              </div>
            )}
          </article>
          <article className="profile-card light">
            <span className="eyebrow">Wishlist</span>
            <h2>{savedProducts.length} saved items</h2>
            <p>Items you save on product cards appear here automatically.</p>
            <button type="button" className="secondary-button" onClick={() => navigate("shop")}>
              Keep browsing
            </button>
          </article>
        </section>
        {savedProducts.length > 0 && (
          <div className="product-grid compact-grid">
            {savedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </>
    );
  }

  function SupportPage() {
    return (
      <>
        <SectionHeader title="Support" subtitle="Help content, service promises, and store policies." />
        <section className="support-grid">
          {[
            ["Shipping", "Free shipping on orders over Rs. 5,000 with live totals in the cart."],
            ["Returns", "Simple seven-day replacement flow for damaged or incorrect items."],
            ["Payments", "UPI, cards, wallets, and cash on delivery are represented in checkout."],
            ["Business", "Admin product and order endpoints can be expanded into a full dashboard."],
          ].map(([title, copy]) => (
            <article key={title} className="feature-card">
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </section>
      </>
    );
  }

  function SectionHeader({ title, subtitle, action, onAction }) {
    return (
      <div className="section-header">
        <div>
          <span className="eyebrow">Nexa Store</span>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && (
          <button type="button" className="secondary-button" onClick={onAction}>
            {action}
          </button>
        )}
      </div>
    );
  }

  function EmptyState({ title, text }) {
    return (
      <div className="empty-state">
        <h3>{title}</h3>
        <p>{text}</p>
        <button type="button" className="secondary-button" onClick={() => navigate("shop")}>
          Browse catalog
        </button>
      </div>
    );
  }

  function OrderSummary({ buttonLabel, onButton, disabled }) {
    return (
      <aside className="summary-panel">
        <span className="eyebrow">Order Summary</span>
        <h2>{formatPrice(total)}</h2>
        <div className="summary-line">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <strong>{shipping === 0 ? "Free" : formatPrice(shipping)}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <p>
          {subtotal >= freeShippingThreshold
            ? "Free shipping unlocked."
            : `${formatPrice(freeShippingThreshold - subtotal)} away from free shipping.`}
        </p>
        {buttonLabel && (
          <button type="button" className="primary-button submit-button" onClick={onButton} disabled={disabled}>
            {buttonLabel}
          </button>
        )}
      </aside>
    );
  }

  const pageMap = {
    home: <HomePage />,
    shop: <ShopPage />,
    product: <ProductPage />,
    cart: <CartPage />,
    checkout: <CheckoutPage />,
    account: <AccountPage />,
    support: <SupportPage />,
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="page-shell">{pageMap[route.page] || <HomePage />}</main>
    </div>
  );
}

export default App;
