import express from "express";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";

const router = express.Router();

// GET /api/profile/all (List all available user profiles in DB)
router.get("/all", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ created_at: 1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profile (Create new user profile in DB)
router.post("/", async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile (defaults to Subi's profile or query by user_id/username)
router.get("/", async (req, res) => {
  try {
    const { user_id, username } = req.query;
    let query = {};

    if (user_id) query.user_id = user_id;
    else if (username) query.username = username;
    else query = { username: "subi" };

    let profile = await Profile.findOne(query);
    if (!profile) {
      profile = await Profile.findOne();
    }

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/profile (Update health profile)
router.put("/", async (req, res) => {
  try {
    const { user_id, ...updates } = req.body;
    let query = {};

    if (user_id) query.user_id = user_id;
    else query = { username: "subi" };

    const updated = await Profile.findOneAndUpdate(query, updates, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.json({ message: "Profile updated successfully", profile: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
