import express from "express";
import { NutritionLog } from "../models/NutritionLog.js";
import { Profile } from "../models/Profile.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const profile = await Profile.findOne({ username: "subi" }) || await Profile.findOne();

    let log = await NutritionLog.findOne({ date: today });
    if (!log) {
      log = await NutritionLog.findOne().sort({ date: -1 });
    }

    res.json({
      user: profile ? {
        full_name: profile.full_name,
        username: profile.username,
        target_calories: profile.metrics?.target_calories || 2050,
      } : { full_name: "Subitsha P", username: "subi", target_calories: 2050 },
      today: log || {
        date: today,
        calorie_target: 2050,
        total_calories: 1820,
        macros: { carbs: 245, protein: 68, fat: 52, fiber: 28 },
        water_ml: 2500,
        meals: [],
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
