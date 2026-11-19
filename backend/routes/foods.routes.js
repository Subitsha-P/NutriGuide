import express from "express";
import { Food } from "../models/Food.js";

const router = express.Router();

// GET /api/foods
router.get("/", async (req, res) => {
  try {
    const { category, search, diet } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (diet) filter.diet_compatibility = diet;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const foods = await Food.find(filter).sort({ name: 1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/foods/:id
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: "Food item not found." });
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
