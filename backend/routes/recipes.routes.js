import express from "express";
import { Recipe } from "../models/Recipe.js";

const router = express.Router();

// GET /api/recipes
router.get("/", async (req, res) => {
  try {
    const { diet_type, category, search, condition } = req.query;
    const filter = {};

    if (diet_type) filter.diet_type = diet_type;
    if (category) filter.category = category;
    if (condition) filter.suitable_conditions = condition;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { cuisine: { $regex: search, $options: "i" } },
        { "ingredients.item": { $regex: search, $options: "i" } },
      ];
    }

    const recipes = await Recipe.find(filter).sort({ title: 1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recipes/:recipe_id
router.get("/:recipe_id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ recipe_id: req.params.recipe_id });
    if (!recipe) return res.status(404).json({ error: "Recipe not found." });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
