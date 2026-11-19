import mongoose from "mongoose";

const childProfileSchema = new mongoose.Schema(
  {
    parent_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    birth_date: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    diet_type: {
      type: String,
      default: "vegetarian",
    },
    allergies: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
    feeding_logs: [
      {
        date: String,
        meal: String,
        food: String,
        amount: String,
        reaction: {
          type: String,
          enum: ["loved", "neutral", "disliked", "allergic"],
          default: "loved",
        },
        notes: String,
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    strict: false,
  }
);

export const ChildProfile = mongoose.models.ChildProfile || mongoose.model("ChildProfile", childProfileSchema);
