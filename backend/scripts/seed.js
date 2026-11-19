import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Profile } from "../models/Profile.js";
import { Food } from "../models/Food.js";
import { Recipe } from "../models/Recipe.js";
import { MealPlan } from "../models/MealPlan.js";
import { NutritionLog } from "../models/NutritionLog.js";
import { ChildProfile } from "../models/ChildProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../../fontend/data");

function normalizeExtendedJson(doc) {
  if (doc === null || doc === undefined) return doc;
  if (Array.isArray(doc)) return doc.map(normalizeExtendedJson);
  if (typeof doc === "object") {
    if (doc.$oid) {
      return mongoose.Types.ObjectId.isValid(doc.$oid)
        ? new mongoose.Types.ObjectId(doc.$oid)
        : new mongoose.Types.ObjectId();
    }
    if (doc.$date) return new Date(doc.$date);
    const out = {};
    for (const [key, val] of Object.entries(doc)) {
      out[key] = normalizeExtendedJson(val);
    }
    return out;
  }
  return doc;
}

function readJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: ${filename} not found at ${filePath}`);
    return null;
  }
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return normalizeExtendedJson(raw);
}

async function seed() {
  console.log("🌱 Starting MongoDB Database Seeder for NutriGuide (User: Subi)...");
  try {
    await connectDB();

    // 1. Seed Users
    console.log("👉 Seeding Users...");
    const rawUsers = readJsonFile("auth.json");
    const usersList = Array.isArray(rawUsers) ? rawUsers : rawUsers ? [rawUsers] : [];
    let primaryUserId = new mongoose.Types.ObjectId("65f1a2b3c4d5e6f7a8b9c0d1");

    for (const u of usersList) {
      await User.deleteMany({ email: u.email.toLowerCase() });
      const created = await User.create({
        _id: u._id || new mongoose.Types.ObjectId(),
        email: u.email.toLowerCase(),
        username: u.username || "subi",
        full_name: u.fullName || u.full_name || "Subitsha P",
        password_hash: (u.email.includes("subi") || u.username === "subi") ? "subi_in_245" : "12345678",
        role: u.role || "authenticated",
        is_verified: true,
      });
      console.log(`   ✅ Seeded user: ${created.full_name} (${created.email})`);
      if (u.username === "subi" || u.email.includes("subi")) {
        primaryUserId = created._id;
      }
    }

    // 2. Seed Profile
    console.log("👉 Seeding Health Profile...");
    const rawProfiles = readJsonFile("profile.json");
    const profilesList = Array.isArray(rawProfiles) ? rawProfiles : rawProfiles ? [rawProfiles] : [];
    for (const p of profilesList) {
      await Profile.deleteMany({ username: p.username || "subi" });
      await Profile.create({
        user_id: p.userId || primaryUserId,
        username: p.username || "subi",
        full_name: p.fullName || p.full_name || "Subitsha P",
        email: p.email,
        age: p.age,
        gender: p.gender,
        height: p.height,
        weight: p.weight,
        activity_level: p.activityLevel || p.activity_level || "moderate",
        goal: p.goal || "maintain",
        diet_type: p.dietType || p.diet_type || "vegetarian",
        allergies: p.allergies || [],
        health_conditions: p.healthConditions || p.health_conditions || [],
        liked_recipe_ids: p.likedRecipeIds || p.liked_recipes || [],
        description: p.description,
        metrics: {
          bmi: p.bmi,
          bmr: p.bmr,
          tdee: p.tdee,
          target_calories: p.targetCalories || p.metrics?.target_calories || 2050,
        },
      });
      console.log(`   ✅ Seeded profile for ${p.fullName || p.full_name || p.username} (Target: ${p.targetCalories || 2050} kcal)`);
    }

    // 3. Seed Foods
    console.log("👉 Seeding Foods Catalog...");
    const foodsData = readJsonFile("foods.json");
    if (Array.isArray(foodsData) && foodsData.length > 0) {
      await Food.deleteMany({});
      const cleaned = foodsData.map((f) => ({
        _id: f._id || new mongoose.Types.ObjectId(),
        name: f.name,
        category: f.category,
        serving_size: f.servingSize || f.serving_size || "1 serving",
        serving_weight_g: f.servingWeightG || f.serving_weight_g || 100,
        calories: f.calories,
        protein: f.protein || 0,
        carbs: f.carbs || 0,
        fat: f.fat || 0,
        fiber: f.fiber || 0,
        allergens: f.allergens || [],
        diet_compatibility: f.dietCompatibility || f.diet_compatibility || [],
        image_url: f.imageUrl || f.image_url,
        description: f.description,
      }));
      await Food.insertMany(cleaned);
      console.log(`   ✅ Seeded ${cleaned.length} food items.`);
    }

    // 4. Seed Recipes
    console.log("👉 Seeding Recipes Catalog...");
    const recipesData = readJsonFile("recipes.json");
    if (Array.isArray(recipesData) && recipesData.length > 0) {
      await Recipe.deleteMany({});
      const cleaned = recipesData.map((r) => ({
        _id: r._id || new mongoose.Types.ObjectId(),
        recipe_id: r.slug || r.recipeId || r.recipe_id || (r.name || r.title || "").toLowerCase().replace(/\s+/g, "-"),
        title: r.name || r.title,
        cuisine: r.region || r.cuisine || "South Indian",
        category: r.course || r.category || "Main Course",
        diet_type: r.dietType || r.diet_type || "vegetarian",
        calories_per_serving: r.nutrition?.calories || r.caloriesPerServing || r.calories_per_serving || 300,
        servings: r.servings || 2,
        prep_time_minutes: r.prepMinutes || r.prepTimeMinutes || r.prep_time_minutes || 10,
        cook_time_minutes: r.cookMinutes || r.cookTimeMinutes || r.cook_time_minutes || 20,
        macros: {
          protein: r.nutrition?.protein || r.macros?.protein || 0,
          carbs: r.nutrition?.carbohydrates || r.macros?.carbs || 0,
          fat: r.nutrition?.fat || r.macros?.fat || 0,
          fiber: r.nutrition?.fiber || r.macros?.fiber || 0,
        },
        ingredients: (r.ingredients || r.keyIngredients || []).map((i) =>
          typeof i === "string"
            ? { item: i, amount: "As needed", quantity: "As needed" }
            : {
                item: i.item,
                amount: i.amount || i.quantity || "As needed",
                quantity: i.quantity || i.amount || "As needed",
              }
        ),
        instructions: r.instructions || [],
        allergens: r.allergens || [],
        suitable_conditions: r.suitableFor || r.suitableConditions || r.suitable_conditions || [],
        image_url: r.imageUrl || r.image_url,
      }));
      await Recipe.insertMany(cleaned);
      console.log(`   ✅ Seeded ${cleaned.length} recipes.`);
    }

    // 5. Seed Meal Plan
    console.log("👉 Seeding Meal Plan...");
    const rawMealPlan = readJsonFile("meal-plan.json");
    const mealPlans = Array.isArray(rawMealPlan) ? rawMealPlan : rawMealPlan ? [rawMealPlan] : [];
    if (mealPlans.length > 0) {
      await MealPlan.deleteMany({ user_id: primaryUserId });
      for (const mp of mealPlans) {
        await MealPlan.create({
          ...mp,
          _id: mp._id || new mongoose.Types.ObjectId(),
          user_id: mp.userId || primaryUserId,
          plan_name: mp.planName || mp.plan_name || "Weekly Balanced Plan",
          daily_calorie_target: mp.targetCalories || mp.dailyCalorieTarget || 2050,
        });
      }
      console.log(`   ✅ Seeded meal plan (${mealPlans.length} plans).`);
    }

    // 6. Seed Nutrition Logs / History
    console.log("👉 Seeding Nutrition Logs & History...");
    const historyData = readJsonFile("history.json");
    if (Array.isArray(historyData) && historyData.length > 0) {
      await NutritionLog.deleteMany({ user_id: primaryUserId });
      const cleaned = historyData.map((h) => ({
        ...h,
        _id: h._id || new mongoose.Types.ObjectId(),
        user_id: h.userId || primaryUserId,
        date: h.planDate || h.date,
        calorie_target: h.targetCalories || h.calorie_target || 2050,
        total_calories: h.totalCalories || h.total_calories || 0,
        macros: {
          carbs: h.totalCarbohydrates || h.macros?.carbs || 0,
          protein: h.totalProtein || h.macros?.protein || 0,
          fat: h.totalFat || h.macros?.fat || 0,
          fiber: h.totalFiber || h.macros?.fiber || 0,
        },
        meals_summary: h.mealsSummary,
      }));
      await NutritionLog.insertMany(cleaned);
      console.log(`   ✅ Seeded ${cleaned.length} days of nutrition intake history.`);
    }

    // 7. Seed Baby Profile
    console.log("👉 Seeding Baby Profile...");
    const rawBaby = readJsonFile("baby.json");
    const babyList = Array.isArray(rawBaby) ? rawBaby : rawBaby ? [rawBaby] : [];
    if (babyList.length > 0) {
      await ChildProfile.deleteMany({ parent_user_id: primaryUserId });
      for (const b of babyList) {
        await ChildProfile.create({
          _id: b._id || new mongoose.Types.ObjectId(),
          parent_user_id: b.userId || primaryUserId,
          name: b.name,
          birth_date: b.birthDate || b.birth_date || "2024-08-10",
          gender: b.gender || "female",
          diet_type: b.dietType || b.diet_type || "vegetarian",
          allergies: b.allergies || [],
          likes: b.likes || [],
          dislikes: b.dislikes || [],
          feeding_logs: b.feedingLogs || b.feeding_logs || [],
        });
        console.log(`   ✅ Seeded child profile: ${b.name}.`);
      }
    }

    console.log("\n🎉 All MongoDB collections have been seeded successfully with Subi's data!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
