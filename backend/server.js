const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")
const userRoutes = require("./routes/userRoutes")
const PORT = process.env.PORT || 5000

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("CORS not allowed for this origin"))
    },
  })
)
app.use(express.json())

if (process.env.MONGO_URI) {
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Database connected"))
.catch(err => console.log(err))
} else {
console.log("MONGO_URI not provided, serving seeded products only")
}

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API running" })
})

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  }

  res.json({
    status: "ok",
    database: dbStatusMap[dbState] || "unknown",
    fallbackMode: !process.env.MONGO_URI,
    timestamp: new Date().toISOString(),
  })
})

app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, ()=>{
console.log(`Server running on port ${PORT}`)
})
