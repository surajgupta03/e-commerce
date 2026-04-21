import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = (
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const fallbackProducts = [
  {
    _id: "p1",
    name: "Pulse Smartwatch",
    category: "Electronics",
    price: 13999,
    stock: 8,
    rating: 4.6,
    description: "Track workouts, sleep, and notifications with a clean AMOLED display.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p2",
    name: "Studio Wireless Headphones",
    category: "Electronics",
    price: 10999,
    stock: 9,
    rating: 4.7,
    description: "Rich sound, soft ear cushions, and a battery that powers a full work week.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p3",
    name: "Nova Tablet Pro",
    category: "Electronics",
    price: 22999,
    stock: 6,
    rating: 4.5,
    description: "Slim tablet for streaming, sketching, and work on the go.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p4",
    name: "Luna Overshirt",
    category: "Fashion",
    price: 4999,
    stock: 20,
    rating: 4.5,
    description: "Relaxed overshirt in brushed cotton for layering through every season.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p5",
    name: "Harbor Linen Shirt",
    category: "Fashion",
    price: 3899,
    stock: 18,
    rating: 4.4,
    description: "Breathable linen shirt tailored for warm days and crisp evenings.",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p6",
    name: "Metro Denim Jacket",
    category: "Fashion",
    price: 5599,
    stock: 13,
    rating: 4.7,
    description: "Classic denim jacket with a soft broken-in feel from day one.",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p7",
    name: "Aether Running Shoes",
    category: "Footwear",
    price: 7499,
    stock: 14,
    rating: 4.8,
    description: "Lightweight knit runners built for daily miles and all-day comfort.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p8",
    name: "Drift Slip-On Sneakers",
    category: "Footwear",
    price: 4299,
    stock: 16,
    rating: 4.3,
    description: "Easy slip-on sneakers with flexible soles for quick city runs.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p9",
    name: "Terrain Trek Boots",
    category: "Footwear",
    price: 8999,
    stock: 7,
    rating: 4.7,
    description: "Rugged ankle boots with grip-ready soles for weekend escapes.",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p10",
    name: "Summit Travel Backpack",
    category: "Accessories",
    price: 6299,
    stock: 11,
    rating: 4.7,
    description: "Weather-ready backpack with organized compartments for commuting and travel.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p11",
    name: "Harbor Sunglasses",
    category: "Accessories",
    price: 2999,
    stock: 18,
    rating: 4.4,
    description: "Classic square frames with polarized lenses and a lightweight fit.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p12",
    name: "Orbit Leather Wallet",
    category: "Accessories",
    price: 2499,
    stock: 24,
    rating: 4.6,
    description: "Slim wallet crafted for everyday carry with smart card organization.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p13",
    name: "Ceramic Brew Set",
    category: "Home",
    price: 3499,
    stock: 16,
    rating: 4.9,
    description: "A minimalist pour-over kit designed to elevate your morning coffee ritual.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p14",
    name: "Cloud Lounge Chair",
    category: "Home",
    price: 16999,
    stock: 5,
    rating: 4.8,
    description: "Soft sculpted seating with a compact footprint for cozy corners.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p15",
    name: "Glow Table Lamp",
    category: "Home",
    price: 2799,
    stock: 21,
    rating: 4.5,
    description: "Soft ambient lighting with a modern silhouette for desks and side tables.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p16",
    name: "Botanical Face Serum",
    category: "Beauty",
    price: 1899,
    stock: 28,
    rating: 4.7,
    description: "Lightweight serum with a dewy finish designed for daily hydration.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p17",
    name: "Velvet Matte Lip Kit",
    category: "Beauty",
    price: 1499,
    stock: 31,
    rating: 4.4,
    description: "Long-wear lip duo with rich pigment and a comfortable matte finish.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
  {
    _id: "p18",
    name: "Herbal Hair Care Duo",
    category: "Beauty",
    price: 2199,
    stock: 19,
    rating: 4.6,
    description: "Shampoo and conditioner pair that helps smooth and strengthen strands.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    reviews: [],
  },
];

const shippingFee = 149;
const freeShippingThreshold = 5000;
const featuredOffers = [
  "Cash on Delivery available in major Indian cities",
  "UPI, cards, and net banking ready at checkout",
  "Easy 7-day returns on eligible items",
];
const adminStatusOptions = ["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
const categoryOrder = ["Electronics", "Fashion", "Footwear", "Accessories", "Home", "Beauty"];

const emptyRegisterState = {
  name: "",
  email: "",
  password: "",
};

const emptyLoginState = {
  email: "",
  password: "",
};

const emptyAdminProductState = {
  name: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  description: "",
};

const emptyReviewState = {
  rating: "5",
  comment: "",
};

const emptyCheckoutState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  paymentMethod: "UPI",
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function normalizeProduct(product) {
  return {
    ...product,
    reviews: Array.isArray(product?.reviews) ? product.reviews : [],
    rating: Number(product?.rating || 0),
  };
}

function getProductIdFromHash() {
  const hash = window.location.hash || "";
  const match = hash.match(/^#\/products\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [maxPriceFilter, setMaxPriceFilter] = useState("25000");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart-items");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentProductPageId, setCurrentProductPageId] = useState(() => getProductIdFromHash());
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [notice, setNotice] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [checkoutState, setCheckoutState] = useState(() => {
    const savedUser = localStorage.getItem("auth-user");
    if (!savedUser) {
      return emptyCheckoutState;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      return {
        ...emptyCheckoutState,
        name: parsedUser?.name || "",
        email: parsedUser?.email || "",
      };
    } catch {
      return emptyCheckoutState;
    }
  });
  const [authMode, setAuthMode] = useState("login");
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [loginState, setLoginState] = useState(emptyLoginState);
  const [registerState, setRegisterState] = useState(emptyRegisterState);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("auth-token") || "");
  const [authUser, setAuthUser] = useState(() => {
    const savedUser = localStorage.getItem("auth-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(false);
  const [reviewState, setReviewState] = useState(emptyReviewState);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [adminProductState, setAdminProductState] = useState(emptyAdminProductState);
  const [adminActionLoading, setAdminActionLoading] = useState(false);

  const isLoggedIn = Boolean(authToken && authUser);
  const isAdmin = authUser?.role === "admin";

  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("auth-token", authToken);
    } else {
      localStorage.removeItem("auth-token");
    }
  }, [authToken]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("auth-user", JSON.stringify(authUser));
      setCheckoutState((current) => ({
        ...current,
        name: current.name || authUser.name || "",
        email: current.email || authUser.email || "",
      }));
    } else {
      localStorage.removeItem("auth-user");
    }
  }, [authUser]);

  async function loadProducts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        timeout: 3000,
      });
      const incomingProducts =
        Array.isArray(response.data) && response.data.length
          ? response.data.map(normalizeProduct)
          : fallbackProducts.map(normalizeProduct);
      setProducts(incomingProducts);
      setSelectedProductId((currentId) => currentId ?? incomingProducts[0]?._id ?? null);
    } catch (error) {
      const nextProducts = fallbackProducts.map(normalizeProduct);
      setProducts(nextProducts);
      setSelectedProductId((currentId) => currentId ?? nextProducts[0]?._id ?? null);
    } finally {
      setLoading(false);
    }
  }

  async function loadRecentOrders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/recent?limit=3`, {
        timeout: 3000,
      });
      setRecentOrders(Array.isArray(response.data) ? response.data.slice(0, 3) : []);
    } catch (error) {
      setRecentOrders([]);
    }
  }

  async function loadOrderHistory(token, user) {
    if (!token || !user) {
      setOrderHistory([]);
      return;
    }

    setOrderHistoryLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(token),
        timeout: 4000,
      });
      setOrderHistory(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setOrderHistory([]);
      showNotice(error.response?.data?.message || "Could not load order history");
    } finally {
      setOrderHistoryLoading(false);
    }
  }

  async function loadProfile(token) {
    if (!token) {
      setAuthUser(null);
      return;
    }

    setProfileLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: getAuthHeaders(token),
        timeout: 4000,
      });
      setAuthUser(response.data);
    } catch (error) {
      setAuthToken("");
      setAuthUser(null);
      setOrderHistory([]);
      showNotice("Your session expired. Please sign in again");
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    loadRecentOrders();
  }, []);

  useEffect(() => {
    function syncProductPageFromHash() {
      setCurrentProductPageId(getProductIdFromHash());
    }

    window.addEventListener("hashchange", syncProductPageFromHash);
    syncProductPageFromHash();

    return () => window.removeEventListener("hashchange", syncProductPageFromHash);
  }, []);

  useEffect(() => {
    if (currentProductPageId) {
      setSelectedProductId(currentProductPageId);
    }
  }, [currentProductPageId]);

  useEffect(() => {
    if (authToken && !authUser) {
      loadProfile(authToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, authUser]);

  useEffect(() => {
    if (authToken && authUser) {
      loadOrderHistory(authToken, authUser);
    } else {
      setOrderHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, authUser]);

  useEffect(() => {
    async function loadRecommendations() {
      if (!selectedProductId) {
        setRecommendations([]);
        return;
      }

      setRecommendationsLoading(true);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/products/${selectedProductId}/recommendations?limit=4`,
          { timeout: 3000 }
        );
        setRecommendations(
          Array.isArray(response.data) ? response.data.map(normalizeProduct) : []
        );
      } catch (error) {
        const selectedProduct = products.find((product) => product._id === selectedProductId);
        const fallbackRecommendationList = products
          .filter((product) => product._id !== selectedProductId)
          .sort((a, b) => {
            const categoryScoreA = a.category === selectedProduct?.category ? 1 : 0;
            const categoryScoreB = b.category === selectedProduct?.category ? 1 : 0;

            if (categoryScoreA !== categoryScoreB) {
              return categoryScoreB - categoryScoreA;
            }

            return (b.rating || 0) - (a.rating || 0);
          })
          .slice(0, 4);

        setRecommendations(fallbackRecommendationList);
      } finally {
        setRecommendationsLoading(false);
      }
    }

    loadRecommendations();
  }, [products, selectedProductId]);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const visibleProducts = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = [product.name, product.category, product.description]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const withinPrice = Number(product.price || 0) <= Number(maxPriceFilter || Infinity);
      const matchesFeatured = !featuredOnly || Number(product.rating || 0) >= 4.5;

      return matchesCategory && matchesSearch && withinPrice && matchesFeatured;
    });

    const sortedProducts = [...visibleProducts];

    switch (sortBy) {
      case "price_asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name_asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sortedProducts.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
    }

    return sortedProducts;
  }, [featuredOnly, maxPriceFilter, products, searchQuery, selectedCategory, sortBy]);

  const categorySections = useMemo(() => {
    const availableCategories =
      selectedCategory === "All" ? categoryOrder : [selectedCategory];

    return availableCategories
      .map((category) => ({
        category,
        products: filteredProducts.filter((product) => product.category === category),
      }))
      .filter((section) => section.products.length > 0);
  }, [filteredProducts, selectedCategory]);

  const selectedProduct = useMemo(() => {
    return (
      products.find((product) => product._id === selectedProductId) ??
      filteredProducts[0] ??
      products[0] ??
      null
    );
  }, [filteredProducts, products, selectedProductId]);

  const currentProductPage = useMemo(() => {
    if (!currentProductPageId) {
      return null;
    }

    return products.find((product) => String(product._id) === String(currentProductPageId)) ?? null;
  }, [currentProductPageId, products]);

  const isProductPage = Boolean(currentProductPageId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = cart.length === 0 || subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  function showNotice(message) {
    setNotice(message);
    window.clearTimeout(showNotice.timeoutId);
    showNotice.timeoutId = window.setTimeout(() => setNotice(""), 3000);
  }

  function updateProductInState(updatedProduct) {
    const normalized = normalizeProduct(updatedProduct);
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product._id === normalized._id ? normalized : product
      )
    );
    setRecommendations((currentRecommendations) =>
      currentRecommendations.map((product) =>
        product._id === normalized._id ? normalized : product
      )
    );
  }

  function openProductPage(productId) {
    setSelectedProductId(productId);
    window.location.hash = `#/products/${encodeURIComponent(productId)}`;
  }

  function closeProductPage() {
    window.location.hash = "#/";
  }

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item._id === product._id);

      if (existingItem) {
        return currentCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock || 99) }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    showNotice(`${product.name} added to cart`);
  }

  function updateQuantity(productId, nextQuantity) {
    if (nextQuantity <= 0) {
      setCart((currentCart) => currentCart.filter((item) => item._id !== productId));
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.min(nextQuantity, item.stock || 99) }
          : item
      )
    );
  }

  function handleCheckoutChange(event) {
    const { name, value } = event.target;
    setCheckoutState((current) => ({ ...current, [name]: value }));
  }

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginState((current) => ({ ...current, [name]: value }));
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterState((current) => ({ ...current, [name]: value }));
  }

  function handleReviewChange(event) {
    const { name, value } = event.target;
    setReviewState((current) => ({ ...current, [name]: value }));
  }

  function handleAdminProductChange(event) {
    const { name, value } = event.target;
    setAdminProductState((current) => ({ ...current, [name]: value }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setAuthLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, loginState, {
        timeout: 4000,
      });
      setAuthToken(response.data.token);
      setAuthUser(response.data.user);
      setShowAuthPanel(false);
      setLoginState(emptyLoginState);
      showNotice(`Welcome back, ${response.data.user.name}`);
    } catch (error) {
      showNotice(error.response?.data?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setAuthLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/users/register`, registerState, {
        timeout: 4000,
      });
      showNotice("Account created. Please sign in");
      setRegisterState(emptyRegisterState);
      setAuthMode("login");
      setLoginState({
        email: registerState.email,
        password: "",
      });
    } catch (error) {
      showNotice(error.response?.data?.message || "Registration failed");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    setAuthToken("");
    setAuthUser(null);
    setOrderHistory([]);
    showNotice("You have been signed out");
  }

  function openAuthPanel(nextMode = "login") {
    setAuthMode(nextMode);
    setShowAuthPanel(true);
  }

  function openAccountSection() {
    document.getElementById("account")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleCheckoutSubmit(event) {
    event.preventDefault();

    const hasEmptyField = Object.entries(checkoutState).some(([key, value]) => {
      if (key === "paymentMethod") {
        return false;
      }

      return !value.trim();
    });

    if (hasEmptyField || cart.length === 0) {
      showNotice("Complete the checkout form and keep at least one item in your cart");
      return;
    }

    const orderPayload = {
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      shipping,
      total,
      paymentMethod: checkoutState.paymentMethod,
      customer: {
        name: checkoutState.name,
        email: checkoutState.email,
        phone: checkoutState.phone,
      },
      shippingAddress: {
        address: checkoutState.address,
        city: checkoutState.city,
        state: checkoutState.state,
        zip: checkoutState.zip,
        country: "India",
      },
    };

    setPlacingOrder(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderPayload, {
        timeout: 4000,
      });
      const savedOrder = response.data;
      setCart([]);
      setOrderPlaced(savedOrder);
      setRecentOrders((currentOrders) => [savedOrder, ...currentOrders].slice(0, 3));
      setCheckoutState((current) => ({
        ...emptyCheckoutState,
        name: authUser?.name || current.name,
        email: authUser?.email || current.email,
      }));
      showNotice("Order placed successfully");

      await loadProducts();
      if (authToken && authUser) {
        await loadOrderHistory(authToken, authUser);
      }
    } catch (error) {
      showNotice(error.response?.data?.message || "Order service is not reachable right now");
    } finally {
      setPlacingOrder(false);
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();
    const reviewTargetProduct = currentProductPage || selectedProduct;

    if (!reviewTargetProduct || !authToken) {
      showNotice("Sign in to leave a review");
      return;
    }

    setReviewSubmitting(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/${reviewTargetProduct._id}/reviews`,
        {
          rating: Number(reviewState.rating),
          comment: reviewState.comment,
        },
        {
          headers: getAuthHeaders(authToken),
          timeout: 4000,
        }
      );
      updateProductInState(response.data);
      setReviewState(emptyReviewState);
      showNotice("Review added");
    } catch (error) {
      showNotice(error.response?.data?.message || "Could not submit review");
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleAdminProductSubmit(event) {
    event.preventDefault();

    if (!authToken || !isAdmin) {
      showNotice("Admin access required");
      return;
    }

    setAdminActionLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/products`,
        {
          ...adminProductState,
          price: Number(adminProductState.price),
          stock: Number(adminProductState.stock),
        },
        {
          headers: getAuthHeaders(authToken),
          timeout: 4000,
        }
      );
      setProducts((currentProducts) => [normalizeProduct(response.data), ...currentProducts]);
      setAdminProductState(emptyAdminProductState);
      showNotice("Product created");
    } catch (error) {
      showNotice(error.response?.data?.message || "Could not create product");
    } finally {
      setAdminActionLoading(false);
    }
  }

  async function handleDeleteProduct(productId) {
    if (!authToken || !isAdmin) {
      showNotice("Admin access required");
      return;
    }

    setAdminActionLoading(true);

    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: getAuthHeaders(authToken),
        timeout: 4000,
      });
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId));
      setRecommendations((currentRecommendations) =>
        currentRecommendations.filter((product) => product._id !== productId)
      );
      setCart((currentCart) => currentCart.filter((item) => item._id !== productId));
      if (selectedProductId === productId) {
        setSelectedProductId(null);
      }
      if (currentProductPageId === productId) {
        closeProductPage();
      }
      showNotice("Product deleted");
    } catch (error) {
      showNotice(error.response?.data?.message || "Could not delete product");
    } finally {
      setAdminActionLoading(false);
    }
  }

  async function handleStatusChange(orderId, nextStatus) {
    if (!authToken || !isAdmin) {
      showNotice("Admin access required");
      return;
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status: nextStatus },
        {
          headers: getAuthHeaders(authToken),
          timeout: 4000,
        }
      );
      const updatedOrder = response.data;
      setOrderHistory((currentOrders) =>
        currentOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
      setRecentOrders((currentOrders) =>
        currentOrders.map((order) =>
          (order._id || order.orderNumber) === (updatedOrder._id || updatedOrder.orderNumber)
            ? updatedOrder
            : order
        )
      );
      showNotice(`Order marked ${nextStatus}`);
    } catch (error) {
      showNotice(error.response?.data?.message || "Could not update order status");
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="topbar">
          <div>
            <p className="eyebrow">India-ready shopping</p>
            <h1>Nexa Store India</h1>
          </div>
          <div className="topbar-meta">
            <span>Curated products</span>
            <button
              type="button"
              className="secondary-button topbar-button"
              onClick={() => setShowCartPanel(true)}
            >
              Cart ({cartCount})
            </button>
            {isLoggedIn ? (
              <>
                <span>{`${authUser.name} (${authUser.role})`}</span>
                <button type="button" className="secondary-button topbar-button" onClick={openAccountSection}>
                  Account
                </button>
              </>
            ) : (
              <button
                type="button"
                className="primary-button topbar-button"
                onClick={() => openAuthPanel("login")}
              >
                Login
              </button>
            )}
          </div>
        </nav>

        <div className="hero-grid">
          <section className="hero-copy">
            <p className="hero-kicker">Full e-commerce experience</p>
            <h2>Your one-stop destination for quality products and effortless shopping.</h2>
            <p className="hero-text">
              The storefront now includes account access, profile-aware checkout, customer order
              history, review posting, and an admin control area for products and order statuses.
            </p>

            <div className="hero-actions">
              <a href="#catalog" className="primary-button">
                Shop collection
              </a>
              {!isLoggedIn && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => openAuthPanel("register")}
                >
                  Create account
                </button>
              )}
              {isLoggedIn && (
                <a href="#account" className="secondary-button">
                  Account area
                </a>
              )}
            </div>

            <div className="stats-grid">
              <article>
                <strong>{products.length || fallbackProducts.length}+</strong>
                <span>Products</span>
              </article>
              <article>
                <strong>{isLoggedIn ? "Live" : "Guest"}</strong>
                <span>Account mode</span>
              </article>
              <article>
                <strong>Free</strong>
                <span>Shipping over {formatPrice(freeShippingThreshold)}</span>
              </article>
            </div>
          </section>

          <aside className="featured-panel">
            {selectedProduct && (
              <>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="featured-image" />
                <div className="featured-content">
                  <div className="featured-header">
                    <span className="category-pill">{selectedProduct.category}</span>
                    <span className="rating-pill">{selectedProduct.rating} star</span>
                  </div>
                  <h3>{selectedProduct.name}</h3>
                  <p>{selectedProduct.description}</p>
                  <div className="featured-meta">
                    <strong>{formatPrice(selectedProduct.price)}</strong>
                    <span>{selectedProduct.stock} pieces ready to ship</span>
                  </div>
                  <ul className="offer-list">
                    {featuredOffers.map((offer) => (
                      <li key={offer}>{offer}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </aside>
        </div>
      </header>

      {notice && <div className="toast">{notice}</div>}

      {showAuthPanel && !isLoggedIn && (
        <div className="modal-backdrop" onClick={() => setShowAuthPanel(false)}>
          <section className="auth-modal" onClick={(event) => event.stopPropagation()}>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Account</p>
                <h2>{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
              </div>
              <button
                type="button"
                className="secondary-button small-button"
                onClick={() => setShowAuthPanel(false)}
              >
                Close
              </button>
            </div>

            <div className="auth-grid">
              <div className="auth-switch">
                <button
                  type="button"
                  className={authMode === "login" ? "chip active" : "chip"}
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={authMode === "register" ? "chip active" : "chip"}
                  onClick={() => setAuthMode("register")}
                >
                  Sign up
                </button>
              </div>

              {authMode === "login" ? (
                <form className="stack-form" onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={loginState.email}
                    onChange={handleLoginChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginState.password}
                    onChange={handleLoginChange}
                  />
                  <button type="submit" className="primary-button submit-button" disabled={authLoading}>
                    {authLoading ? "Signing in..." : "Login"}
                  </button>
                </form>
              ) : (
                <form className="stack-form" onSubmit={handleRegisterSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={registerState.name}
                    onChange={handleRegisterChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={registerState.email}
                    onChange={handleRegisterChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={registerState.password}
                    onChange={handleRegisterChange}
                  />
                  <button type="submit" className="primary-button submit-button" disabled={authLoading}>
                    {authLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      )}

      {showCartPanel && (
        <div className="modal-backdrop" onClick={() => setShowCartPanel(false)}>
          <section className="cart-modal" onClick={(event) => event.stopPropagation()}>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Cart</p>
                <h2>Your bag</h2>
              </div>
              <button
                type="button"
                className="secondary-button small-button"
                onClick={() => setShowCartPanel(false)}
              >
                Close
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <h3>Your cart is empty</h3>
                <p>Add products from the catalog to begin checkout.</p>
              </div>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <article key={item._id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-content">
                        <h3>{item.name}</h3>
                        <p>{formatPrice(item.price)}</p>
                        <div className="quantity-row">
                          <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="summary-card">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? "Free" : formatPrice(shipping)}</strong>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-button submit-button"
                  onClick={() =>
                    document.getElementById("cart-checkout")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                >
                  Go to checkout
                </button>

                <section className="checkout-panel modal-checkout-panel" id="cart-checkout">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">Checkout</p>
                      <h2>Delivery details</h2>
                    </div>
                  </div>

                  <form className="checkout-form" onSubmit={handleCheckoutSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      value={checkoutState.name}
                      onChange={handleCheckoutChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={checkoutState.email}
                      onChange={handleCheckoutChange}
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Mobile number"
                      value={checkoutState.phone}
                      onChange={handleCheckoutChange}
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="House no, street, area"
                      value={checkoutState.address}
                      onChange={handleCheckoutChange}
                    />
                    <div className="checkout-row">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={checkoutState.city}
                        onChange={handleCheckoutChange}
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={checkoutState.state}
                        onChange={handleCheckoutChange}
                      />
                    </div>
                    <div className="checkout-row">
                      <input
                        type="text"
                        name="zip"
                        placeholder="PIN code"
                        value={checkoutState.zip}
                        onChange={handleCheckoutChange}
                      />
                      <select
                        name="paymentMethod"
                        value={checkoutState.paymentMethod}
                        onChange={handleCheckoutChange}
                        className="payment-select"
                      >
                        <option value="UPI">UPI</option>
                        <option value="Card">Debit / Credit Card</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>
                    </div>
                    <button type="submit" className="primary-button submit-button" disabled={placingOrder}>
                      {placingOrder ? "Placing order..." : "Place order"}
                    </button>
                  </form>

                  {orderPlaced && (
                    <div className="success-card">
                      <h3>Order confirmed</h3>
                      <p>
                        Order <strong>{orderPlaced.orderNumber}</strong> placed for{" "}
                        <strong>{formatPrice(orderPlaced.total)}</strong> via {orderPlaced.paymentMethod}.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}
          </section>
        </div>
      )}

      <main className="content-grid">
        {!isProductPage && (
        <section className="catalog-panel" id="catalog">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2>Shop by category</h2>
            </div>
            <p className="muted-text">
              {loading
                ? "Loading products..."
                : `${filteredProducts.length} products across ${categorySections.length} categories`}
            </p>
          </div>

          <div className="toolbar">
            <input
              className="search-input"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products, categories, or keywords"
            />

            <div className="checkout-row">
              <select
                name="sortBy"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="payment-select"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated</option>
                <option value="name_asc">Name: A to Z</option>
              </select>

              <input
                type="number"
                min="1000"
                step="500"
                value={maxPriceFilter}
                onChange={(event) => setMaxPriceFilter(event.target.value)}
                placeholder="Max price"
              />
            </div>

            <div className="category-row">
              <button
                type="button"
                className={featuredOnly ? "chip active" : "chip"}
                onClick={() => setFeaturedOnly((current) => !current)}
              >
                {featuredOnly ? "Showing staff picks" : "Staff picks only"}
              </button>
            </div>

            <div className="category-row">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={category === selectedCategory ? "chip active" : "chip"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-sections">
            {categorySections.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try another category or adjust your search and price filters.</p>
              </div>
            ) : (
              categorySections.map((section) => (
                <section key={section.category} className="category-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Category</p>
                      <h3>{section.category}</h3>
                    </div>
                    <span className="section-count">{section.products.length} products</span>
                  </div>
                  <div className="product-grid">
                    {section.products.map((product) => (
                      <article className="product-card" key={product._id}>
                        <button
                          type="button"
                          className="product-preview"
                          onClick={() => openProductPage(product._id)}
                        >
                          <img src={product.image} alt={product.name} />
                        </button>
                        <div className="product-body">
                          <div className="product-heading">
                            <span className="category-pill">{product.category}</span>
                            <span className="rating-pill">
                              {product.rating} star · {product.reviews.length} reviews
                            </span>
                          </div>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <div className="product-footer">
                            <div>
                              <strong>{formatPrice(product.price)}</strong>
                              <span>{product.stock} in stock</span>
                            </div>
                            <div className="product-actions">
                              <button
                                type="button"
                                className="secondary-button small-button"
                                onClick={() => openProductPage(product._id)}
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                className="primary-button small"
                                onClick={() => addToCart(product)}
                                disabled={Number(product.stock || 0) <= 0}
                              >
                                {Number(product.stock || 0) <= 0 ? "Sold out" : "Add to cart"}
                              </button>
                            </div>
                          </div>
                          {isAdmin && (
                            <button
                              type="button"
                              className="danger-button"
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={adminActionLoading}
                            >
                              Delete product
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>

          {false && <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product._id}>
                <button
                  type="button"
                  className="product-preview"
                  onClick={() => openProductPage(product._id)}
                >
                  <img src={product.image} alt={product.name} />
                </button>
                <div className="product-body">
                  <div className="product-heading">
                    <span className="category-pill">{product.category}</span>
                    <span className="rating-pill">
                      {product.rating} star · {product.reviews.length} reviews
                    </span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-footer">
                    <div>
                      <strong>{formatPrice(product.price)}</strong>
                      <span>{product.stock} in stock</span>
                    </div>
                    <div className="product-actions">
                      <button
                        type="button"
                        className="secondary-button small-button"
                        onClick={() => openProductPage(product._id)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="primary-button small"
                        onClick={() => addToCart(product)}
                        disabled={Number(product.stock || 0) <= 0}
                      >
                        {Number(product.stock || 0) <= 0 ? "Sold out" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={adminActionLoading}
                    >
                      Delete product
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>}
        </section>
        )}

        <aside className="sidebar">
          {isProductPage && currentProductPage && (
            <section className="detail-panel product-page-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Product page</p>
                  <h2>{currentProductPage.name}</h2>
                </div>
                <button
                  type="button"
                  className="secondary-button small-button"
                  onClick={closeProductPage}
                >
                  Back to catalog
                </button>
              </div>
              <div className="product-page-media">
                <img
                  src={currentProductPage.image}
                  alt={currentProductPage.name}
                  className="product-page-image"
                />
              </div>
              <div className="detail-copy">
                <p>{currentProductPage.description}</p>
                <div className="detail-grid">
                  <article>
                    <span>Price</span>
                    <strong>{formatPrice(currentProductPage.price)}</strong>
                  </article>
                  <article>
                    <span>Category</span>
                    <strong>{currentProductPage.category}</strong>
                  </article>
                  <article>
                    <span>Rating</span>
                    <strong>{currentProductPage.rating} / 5</strong>
                  </article>
                  <article>
                    <span>Stock</span>
                    <strong>{currentProductPage.stock} units</strong>
                  </article>
                </div>
                <button
                  type="button"
                  className="primary-button submit-button"
                  onClick={() => addToCart(currentProductPage)}
                  disabled={Number(currentProductPage.stock || 0) <= 0}
                >
                  {Number(currentProductPage.stock || 0) <= 0 ? "Out of stock" : "Buy this now"}
                </button>

                <div className="review-panel">
                  <div className="panel-heading compact-heading">
                    <div>
                      <p className="eyebrow">Reviews</p>
                      <h2>Customer feedback</h2>
                    </div>
                    <span className="muted-text">{currentProductPage.reviews.length} reviews</span>
                  </div>

                  {currentProductPage.reviews.length === 0 ? (
                    <div className="empty-state">
                      <h3>No reviews yet</h3>
                      <p>Be the first shopper to share feedback on this product.</p>
                    </div>
                  ) : (
                    <div className="review-list">
                      {currentProductPage.reviews
                        .slice()
                        .reverse()
                        .map((review, index) => (
                          <article
                            key={`${review.userId || review.userName || "review"}-${index}`}
                            className="review-card"
                          >
                            <div className="review-card-header">
                              <strong>{review.userName || "Customer"}</strong>
                              <span>{review.rating} / 5</span>
                            </div>
                            <p>{review.comment}</p>
                          </article>
                        ))}
                    </div>
                  )}

                  {isLoggedIn ? (
                    <form className="stack-form" onSubmit={handleReviewSubmit}>
                      <div className="checkout-row">
                        <select
                          name="rating"
                          value={reviewState.rating}
                          onChange={handleReviewChange}
                          className="payment-select"
                        >
                          <option value="5">5 stars</option>
                          <option value="4">4 stars</option>
                          <option value="3">3 stars</option>
                          <option value="2">2 stars</option>
                          <option value="1">1 star</option>
                        </select>
                      </div>
                      <textarea
                        name="comment"
                        value={reviewState.comment}
                        onChange={handleReviewChange}
                        placeholder="What stood out about this product?"
                        rows="4"
                      />
                      <button
                        type="submit"
                        className="primary-button submit-button"
                        disabled={reviewSubmitting}
                      >
                        {reviewSubmitting ? "Posting review..." : "Post review"}
                      </button>
                    </form>
                  ) : (
                    <p className="muted-text">Sign in to submit a verified review.</p>
                  )}
                </div>

                <div className="recommendations-block">
                  <div className="panel-heading compact-heading">
                    <div>
                      <p className="eyebrow">Recommended</p>
                      <h2>You may also like</h2>
                    </div>
                    <span className="muted-text">
                      {recommendationsLoading ? "Loading..." : `${recommendations.length} picks`}
                    </span>
                  </div>

                  {recommendations.length === 0 ? (
                    <div className="empty-state">
                      <h3>No recommendations yet</h3>
                      <p>Select a different product to refresh suggestions.</p>
                    </div>
                  ) : (
                    <div className="recommendations-list">
                      {recommendations.map((product) => (
                        <article key={product._id} className="recommendation-card">
                          <button
                            type="button"
                            className="recommendation-media"
                            onClick={() => openProductPage(product._id)}
                          >
                            <img src={product.image} alt={product.name} />
                          </button>
                          <div className="recommendation-copy">
                            <div className="product-heading">
                              <span className="category-pill">{product.category}</span>
                              <span className="rating-pill">{product.rating} star</span>
                            </div>
                            <h3>{product.name}</h3>
                            <p>{formatPrice(product.price)}</p>
                            <div className="product-actions">
                              <button
                                type="button"
                                className="secondary-button small-button"
                                onClick={() => openProductPage(product._id)}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                className="primary-button small"
                                onClick={() => addToCart(product)}
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="orders-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Recent orders</p>
                <h2>Latest checkouts</h2>
              </div>
            </div>

            {recentOrders.length === 0 ? (
              <div className="empty-state">
                <h3>No recent orders</h3>
                <p>Placed orders will appear here as a quick admin-style snapshot.</p>
              </div>
            ) : (
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <article key={order.orderNumber || order._id} className="order-item">
                    <div>
                      <strong>{order.orderNumber || "Pending order"}</strong>
                      <p>{order.customer?.name || "Guest customer"}</p>
                    </div>
                    <div className="order-meta">
                      <span>{order.paymentMethod}</span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {isLoggedIn && (
          <section className="account-panel" id="account">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Account</p>
                <h2>Profile and orders</h2>
              </div>
              <div className="panel-heading-actions">
                {profileLoading && <span className="muted-text">Refreshing profile...</span>}
              </div>
            </div>

              <div className="account-grid">
                <div className="account-card">
                  <h3>{authUser.name}</h3>
                  <p>{authUser.email}</p>
                  <span className="role-badge">{authUser.role}</span>
                  <button type="button" className="secondary-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>

                <div className="order-history-block">
                  <div className="panel-heading compact-heading">
                    <div>
                      <p className="eyebrow">Order history</p>
                      <h2>{isAdmin ? "Admin order desk" : "Your orders"}</h2>
                    </div>
                    <button
                      type="button"
                      className="secondary-button small-button"
                      onClick={() => loadOrderHistory(authToken, authUser)}
                    >
                      Refresh
                    </button>
                  </div>

                  {orderHistoryLoading ? (
                    <p className="muted-text">Loading orders...</p>
                  ) : orderHistory.length === 0 ? (
                    <div className="empty-state">
                      <h3>No orders yet</h3>
                      <p>{isAdmin ? "Customer orders will appear here." : "Your placed orders will show up here."}</p>
                    </div>
                  ) : (
                    <div className="history-list">
                      {orderHistory.map((order) => (
                        <article key={order._id || order.orderNumber} className="history-card">
                          <div className="history-card-top">
                            <div>
                              <strong>{order.orderNumber || order._id}</strong>
                              <p>{order.customer?.name || "Guest customer"}</p>
                            </div>
                            <div className="order-meta">
                              <span>{order.status}</span>
                              <strong>{formatPrice(order.total)}</strong>
                            </div>
                          </div>

                          <div className="history-items">
                            {(order.items || []).map((item, index) => (
                              <div key={`${item.productId || item.name}-${index}`} className="history-item-row">
                                <span>
                                  {item.name} x {item.quantity}
                                </span>
                                <strong>{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</strong>
                              </div>
                            ))}
                          </div>

                          {isAdmin && (
                            <div className="status-row">
                              <span>Update status</span>
                              <select
                                className="payment-select"
                                value={order.status || "Confirmed"}
                                onChange={(event) => handleStatusChange(order._id, event.target.value)}
                              >
                                {adminStatusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="admin-panel">
                    <div className="panel-heading compact-heading">
                      <div>
                        <p className="eyebrow">Admin</p>
                        <h2>Create product</h2>
                      </div>
                    </div>

                    <form className="stack-form" onSubmit={handleAdminProductSubmit}>
                      <input
                        type="text"
                        name="name"
                        placeholder="Product name"
                        value={adminProductState.name}
                        onChange={handleAdminProductChange}
                      />
                      <div className="checkout-row">
                        <input
                          type="text"
                          name="category"
                          placeholder="Category"
                          value={adminProductState.category}
                          onChange={handleAdminProductChange}
                        />
                        <input
                          type="number"
                          name="stock"
                          placeholder="Stock"
                          value={adminProductState.stock}
                          onChange={handleAdminProductChange}
                        />
                      </div>
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={adminProductState.price}
                        onChange={handleAdminProductChange}
                      />
                      <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={adminProductState.image}
                        onChange={handleAdminProductChange}
                      />
                      <textarea
                        name="description"
                        value={adminProductState.description}
                        onChange={handleAdminProductChange}
                        placeholder="Product description"
                        rows="4"
                      />
                      <button
                        type="submit"
                        className="primary-button submit-button"
                        disabled={adminActionLoading}
                      >
                        {adminActionLoading ? "Saving product..." : "Create product"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
          </section>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
