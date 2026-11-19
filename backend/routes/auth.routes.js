import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Support configured password and demo passwords
    const isValid =
      user.password_hash === password ||
      (user.email.includes("subi") && password === "subi_in_245") ||
      (user.email.includes("testing") && (password === "12345678" || password === "subi_in_245"));

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
      token: `demo-token-${user._id}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, username, full_name, password } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const user = await User.create({
      email: email.trim().toLowerCase(),
      username: username || email.split("@")[0],
      full_name: full_name.trim(),
      password_hash: password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/demo-user
router.get("/demo-user", async (req, res) => {
  try {
    const user = await User.findOne({ username: "subi" }) || await User.findOne();
    if (!user) {
      return res.status(404).json({ error: "No demo user found. Run seed script first." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
