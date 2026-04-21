const seedProducts = [
  {
    _id: "seed-product-1",
    name: "Pulse Smartwatch",
    category: "Electronics",
    price: 13999,
    stock: 8,
    rating: 4.6,
    description: "Track workouts, sleep, and notifications with a clean AMOLED display.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Neha",
        rating: 5,
        comment: "Battery life is strong and the display is really crisp.",
        createdAt: "2026-04-08T15:45:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-2",
    name: "Studio Wireless Headphones",
    category: "Electronics",
    price: 10999,
    stock: 9,
    rating: 4.7,
    description: "Rich sound, soft ear cushions, and a battery that powers a full work week.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Amit",
        rating: 5,
        comment: "The sound is balanced and the battery backup is excellent.",
        createdAt: "2026-04-11T09:10:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-3",
    name: "Nova Tablet Pro",
    category: "Electronics",
    price: 22999,
    stock: 6,
    rating: 4.5,
    description: "Slim tablet for streaming, sketching, and work on the go.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Rohan",
        rating: 4,
        comment: "Great display quality and smooth performance for daily use.",
        createdAt: "2026-04-12T11:20:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-4",
    name: "Luna Overshirt",
    category: "Fashion",
    price: 4999,
    stock: 20,
    rating: 4.5,
    description: "Relaxed overshirt in brushed cotton for layering through every season.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Karan",
        rating: 4,
        comment: "Looks premium and fits well over tees.",
        createdAt: "2026-04-07T12:15:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-5",
    name: "Harbor Linen Shirt",
    category: "Fashion",
    price: 3899,
    stock: 18,
    rating: 4.4,
    description: "Breathable linen shirt tailored for warm days and crisp evenings.",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Priya",
        rating: 4,
        comment: "Very airy fabric and the color stays sharp after washing.",
        createdAt: "2026-04-09T13:00:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-6",
    name: "Metro Denim Jacket",
    category: "Fashion",
    price: 5599,
    stock: 13,
    rating: 4.7,
    description: "Classic denim jacket with a soft broken-in feel from day one.",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Ishita",
        rating: 5,
        comment: "Stylish and sturdy, it goes with almost everything.",
        createdAt: "2026-04-06T17:40:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-7",
    name: "Aether Running Shoes",
    category: "Footwear",
    price: 7499,
    stock: 14,
    rating: 4.8,
    description: "Lightweight knit runners built for daily miles and all-day comfort.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Riya",
        rating: 5,
        comment: "Very comfortable and perfect for daily wear.",
        createdAt: "2026-04-10T10:00:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-8",
    name: "Drift Slip-On Sneakers",
    category: "Footwear",
    price: 4299,
    stock: 16,
    rating: 4.3,
    description: "Easy slip-on sneakers with flexible soles for quick city runs.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Ankit",
        rating: 4,
        comment: "Super easy to wear and lightweight enough for travel.",
        createdAt: "2026-04-05T08:15:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-9",
    name: "Terrain Trek Boots",
    category: "Footwear",
    price: 8999,
    stock: 7,
    rating: 4.7,
    description: "Rugged ankle boots with grip-ready soles for weekend escapes.",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Kabir",
        rating: 5,
        comment: "Excellent grip and really solid support on uneven ground.",
        createdAt: "2026-04-14T06:25:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-10",
    name: "Summit Travel Backpack",
    category: "Accessories",
    price: 6299,
    stock: 11,
    rating: 4.7,
    description: "Weather-ready backpack with organized compartments for commuting and travel.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Arjun",
        rating: 4,
        comment: "Great compartments and quality fabric for travel.",
        createdAt: "2026-04-09T08:30:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-11",
    name: "Harbor Sunglasses",
    category: "Accessories",
    price: 2999,
    stock: 18,
    rating: 4.4,
    description: "Classic square frames with polarized lenses and a lightweight fit.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Maya",
        rating: 4,
        comment: "Stylish frames and comfortable enough for long drives.",
        createdAt: "2026-04-07T09:45:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-12",
    name: "Orbit Leather Wallet",
    category: "Accessories",
    price: 2499,
    stock: 24,
    rating: 4.6,
    description: "Slim wallet crafted for everyday carry with smart card organization.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Dev",
        rating: 5,
        comment: "Compact, premium feel, and fits neatly into front pockets.",
        createdAt: "2026-04-15T12:05:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-13",
    name: "Ceramic Brew Set",
    category: "Home",
    price: 3499,
    stock: 16,
    rating: 4.9,
    description: "A minimalist pour-over kit designed to elevate your morning coffee ritual.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Sonal",
        rating: 5,
        comment: "Beautiful finish and makes the kitchen counter look amazing.",
        createdAt: "2026-04-13T14:30:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-14",
    name: "Cloud Lounge Chair",
    category: "Home",
    price: 16999,
    stock: 5,
    rating: 4.8,
    description: "Soft sculpted seating with a compact footprint for cozy corners.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Vikram",
        rating: 5,
        comment: "Looks designer-made and feels extremely comfortable.",
        createdAt: "2026-04-04T18:20:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-15",
    name: "Glow Table Lamp",
    category: "Home",
    price: 2799,
    stock: 21,
    rating: 4.5,
    description: "Soft ambient lighting with a modern silhouette for desks and side tables.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Nidhi",
        rating: 4,
        comment: "Warm lighting and great finish for the price.",
        createdAt: "2026-04-03T10:55:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-16",
    name: "Botanical Face Serum",
    category: "Beauty",
    price: 1899,
    stock: 28,
    rating: 4.7,
    description: "Lightweight serum with a dewy finish designed for daily hydration.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Tanya",
        rating: 5,
        comment: "Absorbs quickly and leaves the skin feeling really fresh.",
        createdAt: "2026-04-10T07:50:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-17",
    name: "Velvet Matte Lip Kit",
    category: "Beauty",
    price: 1499,
    stock: 31,
    rating: 4.4,
    description: "Long-wear lip duo with rich pigment and a comfortable matte finish.",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Meera",
        rating: 4,
        comment: "Pigmented shades and surprisingly lightweight formula.",
        createdAt: "2026-04-11T16:10:00.000Z",
      },
    ],
  },
  {
    _id: "seed-product-18",
    name: "Herbal Hair Care Duo",
    category: "Beauty",
    price: 2199,
    stock: 19,
    rating: 4.6,
    description: "Shampoo and conditioner pair that helps smooth and strengthen strands.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    reviews: [
      {
        userName: "Simran",
        rating: 5,
        comment: "Hair feels softer after a few washes and smells really nice.",
        createdAt: "2026-04-16T08:40:00.000Z",
      },
    ],
  },
];

module.exports = seedProducts;
