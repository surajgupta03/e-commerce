const seedProducts = require("./seedProducts");

const fallbackProducts = seedProducts.map((product, index) => ({
  _id: product._id || `seed-product-${index + 1}`,
  ...product,
  reviews: product.reviews || [],
}));

const fallbackUsers = [
  {
    _id: "fallback-admin",
    name: "Admin User",
    email: "admin@nexastore.in",
    password: "Admin@123",
    role: "admin",
  },
  {
    _id: "fallback-customer",
    name: "Demo Customer",
    email: "demo@nexastore.in",
    password: "Demo@123",
    role: "user",
  },
];

const fallbackOrders = [];

module.exports = {
  fallbackOrders,
  fallbackProducts,
  fallbackUsers,
};
