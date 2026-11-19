import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

async function run() {
  console.log("🔍 Testing MongoDB Atlas Connection...");
  console.log("URI:", process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ":****@") : "undefined");

  try {
    const conn = await connectDB();
    console.log("🎉 Connection Test Passed!");
    console.log("- Database Name:", conn.connection.name);
    console.log("- Host:", conn.connection.host);
    console.log("- Ready State:", conn.connection.readyState === 1 ? "Connected (1)" : conn.connection.readyState);

    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("- Existing Collections:", collections.map((c) => c.name));

    await mongoose.disconnect();
    console.log("👋 Disconnected cleanly.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  }
}

run();
