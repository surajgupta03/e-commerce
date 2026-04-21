const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");
const { fallbackProducts } = require("../data/fallbackStore");

const SORT_OPTIONS = {
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  price_asc: (a, b) => Number(a.price || 0) - Number(b.price || 0),
  price_desc: (a, b) => Number(b.price || 0) - Number(a.price || 0),
  rating_desc: (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
  name_asc: (a, b) => String(a.name || "").localeCompare(String(b.name || "")),
};

function sortProductsByNewest(products) {
  return [...products].sort((a, b) => {
    const aTime = new Date(a.createdAt || 0).getTime();
    const bTime = new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

function recalculateRating(product) {
  const reviews = product.reviews || [];
  if (!reviews.length) {
    product.rating = 0;
    return product;
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  product.rating = Number((total / reviews.length).toFixed(1));
  return product;
}

function normalizeProduct(product) {
  return recalculateRating({
    ...product,
    reviews: product.reviews || [],
  });
}

function parsePositiveNumber(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function filterProducts(products, query) {
  const searchTerm = String(query.search || "").trim().toLowerCase();
  const category = String(query.category || "").trim().toLowerCase();
  const minPrice = parsePositiveNumber(query.minPrice);
  const maxPrice = parsePositiveNumber(query.maxPrice);
  const featuredOnly = query.featured === "true";

  return products.filter((product) => {
    const haystack = [product.name, product.category, product.description]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesCategory = !category || String(product.category || "").toLowerCase() === category;
    const price = Number(product.price || 0);
    const matchesMinPrice = minPrice === undefined || price >= minPrice;
    const matchesMaxPrice = maxPrice === undefined || price <= maxPrice;
    const matchesFeatured = !featuredOnly || Number(product.rating || 0) >= 4.5;

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesFeatured;
  });
}

function sortAndLimitProducts(products, query) {
  const sortKey = SORT_OPTIONS[query.sort] ? query.sort : "newest";
  const limit = Math.max(1, Math.min(Number(query.limit) || products.length, 50));

  return [...products].sort(SORT_OPTIONS[sortKey]).slice(0, limit);
}

function buildMongoQuery(query) {
  const mongoQuery = {};
  const searchTerm = String(query.search || "").trim();
  const category = String(query.category || "").trim();
  const minPrice = parsePositiveNumber(query.minPrice);
  const maxPrice = parsePositiveNumber(query.maxPrice);

  if (searchTerm) {
    mongoQuery.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (category) {
    mongoQuery.category = new RegExp(`^${category}$`, "i");
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    mongoQuery.price = {};
    if (minPrice !== undefined) {
      mongoQuery.price.$gte = minPrice;
    }
    if (maxPrice !== undefined) {
      mongoQuery.price.$lte = maxPrice;
    }
  }

  if (query.featured === "true") {
    mongoQuery.rating = { ...(mongoQuery.rating || {}), $gte: 4.5 };
  }

  return mongoQuery;
}

function buildMongoSort(sort) {
  switch (sort) {
    case "price_asc":
      return { price: 1 };
    case "price_desc":
      return { price: -1 };
    case "rating_desc":
      return { rating: -1, createdAt: -1 };
    case "name_asc":
      return { name: 1 };
    default:
      return { createdAt: -1 };
  }
}

function buildRecommendations(products, selectedProductId, limit) {
  const selectedProduct = products.find((product) => String(product._id) === String(selectedProductId));

  if (!selectedProduct) {
    return [];
  }

  return products
    .filter((product) => String(product._id) !== String(selectedProductId))
    .sort((a, b) => {
      const categoryScoreA = a.category === selectedProduct.category ? 1 : 0;
      const categoryScoreB = b.category === selectedProduct.category ? 1 : 0;

      if (categoryScoreA !== categoryScoreB) {
        return categoryScoreB - categoryScoreA;
      }

      const ratingDiff = Number(b.rating || 0) - Number(a.rating || 0);
      if (ratingDiff !== 0) {
        return ratingDiff;
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    })
    .slice(0, limit);
}

router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const safeCategories = categories.filter(Boolean).sort((a, b) => a.localeCompare(b));

    if (!safeCategories.length) {
      throw new Error("No categories in database");
    }

    res.json(safeCategories);
  } catch (error) {
    const categories = [...new Set(fallbackProducts.map((product) => product.category))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    res.json(categories);
  }
});

router.get("/featured", async (req, res) => {
  const featureQuery = { ...req.query, featured: "true", limit: req.query.limit || "6" };

  try {
    const products = await Product.find(buildMongoQuery(featureQuery))
      .sort(buildMongoSort(featureQuery.sort))
      .limit(Math.max(1, Math.min(Number(featureQuery.limit) || 6, 50)));

    if (!products.length) {
      throw new Error("No featured products in database");
    }

    res.json(products.map((product) => normalizeProduct(product.toObject ? product.toObject() : product)));
  } catch (error) {
    const products = sortAndLimitProducts(filterProducts(fallbackProducts, featureQuery), featureQuery);
    res.json(products.map(normalizeProduct));
  }
});

router.get("/:id/recommendations", async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 4, 8));

  try {
    const selectedProduct = await Product.findById(req.params.id);

    if (!selectedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sameCategoryProducts = await Product.find({
      _id: { $ne: req.params.id },
      category: selectedProduct.category,
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    if (sameCategoryProducts.length >= limit) {
      return res.json(
        sameCategoryProducts.map((product) =>
          normalizeProduct(product.toObject ? product.toObject() : product)
        )
      );
    }

    const extraProducts = await Product.find({
      _id: { $ne: req.params.id },
      category: { $ne: selectedProduct.category },
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    const recommendations = [...sameCategoryProducts, ...extraProducts].slice(0, limit);
    return res.json(
      recommendations.map((product) =>
        normalizeProduct(product.toObject ? product.toObject() : product)
      )
    );
  } catch (error) {
    const recommendations = buildRecommendations(fallbackProducts, req.params.id, limit);

    if (!recommendations.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(recommendations.map(normalizeProduct));
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find(buildMongoQuery(req.query))
      .sort(buildMongoSort(req.query.sort))
      .limit(Math.max(1, Math.min(Number(req.query.limit) || 50, 50)));

    if (!products.length) {
      return res.json(sortAndLimitProducts(filterProducts(fallbackProducts, req.query), req.query));
    }

    res.json(products.map((product) => normalizeProduct(product.toObject ? product.toObject() : product)));
  } catch (error) {
    res.json(sortAndLimitProducts(filterProducts(fallbackProducts, req.query), req.query));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    const product = fallbackProducts.find((item) => item._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  }
});

router.post("/", auth, adminOnly, async (req, res) => {
  const productData = {
    ...req.body,
    reviews: req.body.reviews || [],
  };

  try {
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    const fallbackProduct = {
      _id: `fallback-product-${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
    };
    fallbackProducts.unshift(recalculateRating(fallbackProduct));
    res.status(201).json(fallbackProduct);
  }
});

router.post("/:id/reviews", auth, async (req, res) => {
  const rating = Number(req.body.rating);
  const reviewData = {
    userId: req.user.id,
    userName: req.user.name || "Customer",
    rating,
    comment: req.body.comment,
    createdAt: new Date(),
  };

  if (!rating || rating < 1 || rating > 5 || !reviewData.comment?.trim()) {
    return res.status(400).json({ message: "Rating must be 1 to 5 and comment is required" });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = (product.reviews || []).some((review) => review.userId === req.user.id);

    if (alreadyReviewed) {
      return res.status(409).json({ message: "You have already reviewed this product" });
    }

    product.reviews = [...(product.reviews || []), reviewData];
    recalculateRating(product);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    const product = fallbackProducts.find((item) => item._id === req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = (product.reviews || []).some((review) => review.userId === req.user.id);

    if (alreadyReviewed) {
      return res.status(409).json({ message: "You have already reviewed this product" });
    }

    product.reviews = [...(product.reviews || []), reviewData];
    recalculateRating(product);
    res.status(201).json(product);
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    const productIndex = fallbackProducts.findIndex((item) => item._id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    fallbackProducts.splice(productIndex, 1);
    res.json({ message: "Deleted" });
  }
});

module.exports = router;
