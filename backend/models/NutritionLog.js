import mongoose from "mongoose";

const nutritionLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true, // format "YYYY-MM-DD"
    },
    calorie_target: {
      type: Number,
      default: 2050,
    },
    total_calories: {
      type: Number,
      default: 0,
    },
    macros: {
      carbs: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    water_ml: {
      type: Number,
      default: 2500,
    },
    meals: [
      {
        meal_type: {
          type: String,
          enum: ["breakfast", "lunch", "snack", "dinner"],
          required: true,
        },
        food_name: { type: String, required: true },
        portion: { type: String, default: "1 serving" },
        calories: { type: Number, required: true },
        logged_at: { type: String },
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    strict: false,
  }
);

nutritionLogSchema.index({ user_id: 1, date: 1 }, { unique: true });

export const NutritionLog = mongoose.models.NutritionLog || mongoose.model("NutritionLog", nutritionLogSchema);
