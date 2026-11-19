import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    serving_size: {
      type: String,
      required: true,
    },
    serving_weight_g: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbs: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    fiber: {
      type: Number,
      default: 0,
    },
    allergens: {
      type: [String],
      default: [],
    },
    diet_compatibility: {
      type: [String],
      default: [],
    },
    image_url: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    strict: false,
  }
);

export const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);
