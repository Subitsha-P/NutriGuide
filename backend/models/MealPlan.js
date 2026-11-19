import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan_name: {
      type: String,
      default: "Weekly Balanced Plan",
    },
    week_start: {
      type: String,
    },
    daily_calorie_target: {
      type: Number,
      default: 2050,
    },
    days: [
      {
        day: { type: String, required: true },
        total_calories: { type: Number, default: 0 },
        meals: {
          breakfast: [
            {
              item: String,
              portion: String,
              calories: Number,
              recipe_id: String,
            },
          ],
          lunch: [
            {
              item: String,
              portion: String,
              calories: Number,
              recipe_id: String,
            },
          ],
          snack: [
            {
              item: String,
              portion: String,
              calories: Number,
              recipe_id: String,
            },
          ],
          dinner: [
            {
              item: String,
              portion: String,
              calories: Number,
              recipe_id: String,
            },
          ],
        },
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    strict: false,
  }
);

export const MealPlan = mongoose.models.MealPlan || mongoose.model("MealPlan", mealPlanSchema);
