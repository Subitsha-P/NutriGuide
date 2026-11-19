import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import foodsRoutes from "./routes/foods.routes.js";
import recipesRoutes from "./routes/recipes.routes.js";
import mealPlansRoutes from "./routes/meal-plans.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import historyRoutes from "./routes/history.routes.js";
import babyRoutes from "./routes/baby.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/meal-plans", mealPlansRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/baby", babyRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    service: "NutriGuide Backend API",
    sample_user: "subi",
    database: {
      status: states[dbState] || "unknown",
      readyState: dbState,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
    },
    timestamp: new Date().toISOString(),
  });
});

// Root welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to NutriGuide Backend API",
    database_connected: mongoose.connection.readyState === 1,
    documentation: {
      health: "/api/health",
      auth: "/api/auth/demo-user",
      profile: "/api/profile",
      foods: "/api/foods",
      recipes: "/api/recipes",
      meal_plans: "/api/meal-plans",
      dashboard: "/api/dashboard",
      history: "/api/history",
      baby: "/api/baby",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Not Found - ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Start Server & Connect Database
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 NutriGuide backend server listening on port ${PORT}`);
      console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("❌ Failed to start server due to DB connection error:", err.message);
    process.exit(1);
  }
}

startServer();
