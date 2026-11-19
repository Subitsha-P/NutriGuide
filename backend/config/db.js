import dns from "node:dns";
import mongoose from "mongoose";

// Ensure DNS resolution succeeds even on networks where default DNS fails on SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch {
  // Ignore if custom DNS cannot be set
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in environment variables.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);

    mongoose.connection.on("error", (err) => {
      console.error(`⚠️ MongoDB connection runtime error:`, err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB connection disconnected. Attempting reconnect...");
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error:`, error.message);
    throw error;
  }
}
