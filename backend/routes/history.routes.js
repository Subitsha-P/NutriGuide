import express from "express";
import { NutritionLog } from "../models/NutritionLog.js";

const router = express.Router();

// GET /api/history (7-day or 30-day nutrition logs)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 7;
    const logs = await NutritionLog.find().sort({ date: -1 }).limit(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
