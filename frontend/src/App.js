import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import SupportPage from "./pages/SupportPage";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

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
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
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

const shippingFee = 149;
const freeShippingThreshold = 5000;

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function App() {
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
  const [loggedIn, setLoggedIn] = useState(false);

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

  const homeCarouselProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 5),
    [products]
  );

  const trendingProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 8),
    [products]
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

  function handleCheckout() {
    if (cart.length === 0) return;

    setOrder({
      number: `NX-${Date.now().toString().slice(-6)}`,
      total,
      items: cart,
      customer,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setCart([]);
  }

  function handleLogin({ name, email }) {
    setCustomer((current) => ({
      ...current,
      name: name || current.name || "Shopper",
      email,
    }));
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      payment: "UPI",
    });
  }

  return (
    <Router>
      <div className="app-shell">
        <Header cartCount={cartCount} loggedIn={loggedIn} onLogout={handleLogout} />
        <main className="page-shell">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  products={products}
                  categories={categories}
                  query={query}
                  setQuery={setQuery}
                  category={category}
                  setCategory={setCategory}
                  homeCarouselProducts={homeCarouselProducts}
                  trendingProducts={trendingProducts}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  loading={loading}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <ShopPage
                  visibleProducts={visibleProducts}
                  categories={categories}
                  category={category}
                  setCategory={setCategory}
                  sort={sort}
                  setSort={setSort}
                  query={query}
                  setQuery={setQuery}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  loading={loading}
                />
              }
            />
            <Route path="/product/:id" element={<ProductPage products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />} />
            <Route
              path="/cart"
              element={
                <CartPage
                  cart={cart}
                  updateQuantity={updateQuantity}
                  cartCount={cartCount}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  formatPrice={formatPrice}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <CheckoutPage
                  cart={cart}
                  customer={customer}
                  setCustomer={setCustomer}
                  handleCheckout={handleCheckout}
                  total={total}
                  subtotal={subtotal}
                  shipping={shipping}
                  formatPrice={formatPrice}
                />
              }
            />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route
              path="/account"
              element={
                <AccountPage
                  wishlist={wishlist}
                  products={products}
                  customer={customer}
                  order={order}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="*"
              element={
                <HomePage
                  products={products}
                  categories={categories}
                  query={query}
                  setQuery={setQuery}
                  category={category}
                  setCategory={setCategory}
                  homeCarouselProducts={homeCarouselProducts}
                  trendingProducts={trendingProducts}
                  addToCart={addToCart}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  loading={loading}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;