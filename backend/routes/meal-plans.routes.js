import express from "express";
import { MealPlan } from "../models/MealPlan.js";

const router = express.Router();

// GET /api/meal-plans (latest or by user)
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id ? { user_id } : {};
    const plan = await MealPlan.findOne(query).sort({ created_at: -1 });

    if (!plan) return res.status(404).json({ error: "No meal plan found." });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/meal-plans (create or update)
router.post("/", async (req, res) => {
  try {
    const plan = await MealPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
