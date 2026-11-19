import express from "express";
import { ChildProfile } from "../models/ChildProfile.js";

const router = express.Router();

// GET /api/baby (first child profile or by id)
router.get("/", async (req, res) => {
  try {
    const child = await ChildProfile.findOne();
    if (!child) return res.status(404).json({ error: "No child profile found." });
    res.json(child);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/baby/log (Add feeding log)
router.post("/log", async (req, res) => {
  try {
    const { meal, food, amount, reaction, notes, date } = req.body;
    let child = await ChildProfile.findOne();
    if (!child) {
      return res.status(404).json({ error: "No child profile found to attach log." });
    }

    child.feeding_logs.push({
      date: date || new Date().toISOString().slice(0, 10),
      meal,
      food,
      amount,
      reaction: reaction || "loved",
      notes,
    });

    await child.save();
    res.status(201).json({ message: "Feeding logged successfully", child });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
