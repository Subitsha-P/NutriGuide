import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      default: "subi",
    },
    full_name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    height: {
      type: Number,
      required: true,
      min: 100,
      max: 250,
    },
    weight: {
      type: Number,
      required: true,
      min: 25,
      max: 300,
    },
    activity_level: {
      type: String,
      enum: ["sedentary", "light", "moderate", "very", "extreme"],
      default: "moderate",
    },
    goal: {
      type: String,
      enum: ["lose", "maintain", "gain"],
      default: "maintain",
    },
    diet_type: {
      type: String,
      enum: ["vegetarian", "non_vegetarian", "vegan", "eggetarian"],
      default: "vegetarian",
    },
    allergies: {
      type: [String],
      default: [],
    },
    health_conditions: {
      type: [String],
      default: [],
    },
    liked_recipe_ids: {
      type: [String],
      default: [],
    },
    metrics: {
      bmi: { type: Number },
      bmr: { type: Number },
      tdee: { type: Number },
      target_calories: { type: Number },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    strict: false,
  }
);

export const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
