import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      default: "South Indian",
    },
    category: {
      type: String,
      required: true,
    },
    diet_type: {
      type: String,
      required: true,
    },
    calories_per_serving: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      default: 2,
    },
    prep_time_minutes: {
      type: Number,
      default: 10,
    },
    cook_time_minutes: {
      type: Number,
      default: 20,
    },
    macros: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    ingredients: [
      {
        item: { type: String, required: true },
        amount: { type: String },
        quantity: { type: String },
        calories: { type: Number },
      },
    ],
    instructions: {
      type: [String],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },
    suitable_conditions: {
      type: [String],
      default: [],
    },
    image_url: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    strict: false,
  }
);

export const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
