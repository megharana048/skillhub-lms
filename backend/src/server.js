import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const port = process.env.PORT || 5000;

async function start() {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing.");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing.");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");

    app.listen(port, () => {
      console.log(`SkillHub API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

start();
