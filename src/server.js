// server.js — COMPLETE. Connects to MongoDB, then starts the Express app.
// You do not need to change this file.

import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "./app.js";

const PORT = process.env.PORT || 3001;
let memoryServer;

try {
  const MONGODB_URI = process.env.MONGODB_URI || (await (async () => {
    memoryServer = await MongoMemoryServer.create();
    return memoryServer.getUri();
  })());

  process.env.MONGODB_URI = MONGODB_URI;
  await mongoose.connect(MONGODB_URI);
  console.log(memoryServer ? "✅ Connected to in-memory MongoDB" : "✅ Connected to MongoDB");
  app.listen(PORT, () => console.log(`✅ Streamly API on http://localhost:${PORT}`));
} catch (err) {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  process.exit(1);
}
