const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");
const { fallbackOrders } = require("../data/fallbackStore");
const Product = require("../models/Product");
const { fallbackProducts } = require("../data/fallbackStore");

function createOrderNumber() {
  return `NXI-${Date.now().toString().slice(-8)}`;
}

function filterOrdersByEmail(orders, email) {
  if (!email) {
    return orders;
  }

  return orders.filter((order) => order.customer?.email === email);
}

function validateOrderPayload(body) {
  const requiredCustomerFields = ["name", "email", "phone"];
  const requiredAddressFields = ["address", "city", "state", "zip", "country"];

  const hasCustomerFields = requiredCustomerFields.every((field) => body.customer?.[field]?.trim?.());
  const hasAddressFields = requiredAddressFields.every((field) => body.shippingAddress?.[field]?.trim?.());
  const hasItems = Array.isArray(body.items) && body.items.length > 0;
  const hasValidItems =
    hasItems &&
    body.items.every(
      (item) =>
        item?.productId &&
        item?.name &&
        Number(item?.price) >= 0 &&
        Number(item?.quantity) > 0
    );

  if (!hasCustomerFields || !hasAddressFields || !hasValidItems || !body.paymentMethod) {
    return "Customer, address, payment method, and at least one valid item are required";
  }

  return null;
}

function sanitizeRecentOrders(orders) {
  return orders.map((order) => ({
    _id: order._id,
    orderNumber: order.orderNumber,
    total: order.total,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
    customer: {
      name: order.customer?.name,
    },
  }));
}

function sortOrdersByNewest(orders) {
  return [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

async function validateAndApplyInventory(items) {
  const productIds = items.map((item) => item.productId);
  const dbProducts = await Product.find({ _id: { $in: productIds } });

  if (!dbProducts.length) {
    throw new Error("Database inventory unavailable");
  }

  const productMap = new Map(dbProducts.map((product) => [String(product._id), product]));

  for (const item of items) {
    const product = productMap.get(String(item.productId));

    if (!product) {
      return { ok: false, message: `Product not found for item ${item.name}` };
    }

    if (Number(product.stock || 0) < Number(item.quantity || 0)) {
      return { ok: false, message: `${product.name} does not have enough stock` };
    }
  }

  for (const item of items) {
    const product = productMap.get(String(item.productId));
    product.stock = Number(product.stock || 0) - Number(item.quantity || 0);
    await product.save();
  }

  return { ok: true };
}

function validateFallbackInventory(items) {
  const productMap = new Map(fallbackProducts.map((product) => [String(product._id), product]));

  for (const item of items) {
    const product = productMap.get(String(item.productId));

    if (!product) {
      return { ok: false, message: `Product not found for item ${item.name}` };
    }

    if (Number(product.stock || 0) < Number(item.quantity || 0)) {
      return { ok: false, message: `${product.name} does not have enough stock` };
    }
  }

  for (const item of items) {
    const product = productMap.get(String(item.productId));
    product.stock = Number(product.stock || 0) - Number(item.quantity || 0);
  }

  return { ok: true };
}

router.get("/recent", async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 5, 10));

  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    if (!orders.length) {
      return res.json(sanitizeRecentOrders(sortOrdersByNewest(fallbackOrders).slice(0, limit)));
    }

    res.json(sanitizeRecentOrders(orders));
  } catch (error) {
    res.json(sanitizeRecentOrders(sortOrdersByNewest(fallbackOrders).slice(0, limit)));
  }
});

router.get("/", auth, async (req, res) => {
  const emailFilter = req.user.role === "admin" ? req.query.email : req.user.email;

  try {
    const query = emailFilter ? { "customer.email": emailFilter } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(20);

    if (!orders.length) {
      return res.json(filterOrdersByEmail(fallbackOrders, emailFilter));
    }

    res.json(orders);
  } catch (error) {
    res.json(filterOrdersByEmail(fallbackOrders, emailFilter));
  }
});

router.post("/", async (req, res) => {
  const validationError = validateOrderPayload(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const orderData = {
    ...req.body,
    orderNumber: createOrderNumber(),
    status: "Confirmed",
  };

  try {
    const inventoryResult = await validateAndApplyInventory(orderData.items);

    if (!inventoryResult.ok) {
      return res.status(400).json({ message: inventoryResult.message });
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    const inventoryResult = validateFallbackInventory(orderData.items);

    if (!inventoryResult.ok) {
      return res.status(400).json({ message: inventoryResult.message });
    }

    const fallbackOrder = {
      _id: createOrderNumber(),
      ...orderData,
      createdAt: new Date().toISOString(),
    };
    fallbackOrders.unshift(fallbackOrder);
    res.status(201).json(fallbackOrder);
  }
});

router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    const order = fallbackOrders.find(
      (item) => item._id === req.params.id || item.orderNumber === req.params.id
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    res.json(order);
  }
});

module.exports = router;
