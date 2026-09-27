// seed.js — COMPLETE. Run `npm run seed` to insert one channel + five videos,
// so your GET /channels/:id/top-videos endpoint has real data to return.
// It prints the channel id — use it to test your aggregation endpoint.

import "dotenv/config";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Channel } from "./models/channel.model.js";
import { Video } from "./models/video.model.js";

let memoryServer;

try {
  const MONGODB_URI = process.env.MONGODB_URI || (await (async () => {
    memoryServer = await MongoMemoryServer.create();
    return memoryServer.getUri();
  })());

  process.env.MONGODB_URI = MONGODB_URI;
  await mongoose.connect(MONGODB_URI);

  await Channel.deleteMany({});
  await Video.deleteMany({});

  const channel = await Channel.create({ name: "Streamly Originals", handle: "streamly" });

  await Video.create([
    { title: "Getting Started",  channelId: channel._id, slug: "getting-started",  views: 1200, status: "published" },
    { title: "Deep Dive",        channelId: channel._id, slug: "deep-dive",        views: 8700, status: "published" },
    { title: "Quick Tips",       channelId: channel._id, slug: "quick-tips",       views: 430,  status: "published" },
    { title: "Behind the Scenes",channelId: channel._id, slug: "behind-the-scenes",views: 5600, status: "published" },
    { title: "Draft Episode",    channelId: channel._id, slug: "draft-episode",    views: 0,    status: "draft" },
  ]);

  console.log("✅ Seeded 1 channel + 5 videos.");
  console.log("   Channel id:", channel._id.toString());
  console.log("   Try: GET http://localhost:3001/channels/" + channel._id.toString() + "/top-videos");

  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
  process.exit(0);
} catch (err) {
  console.error("❌ Seed failed:", err.message);
  console.error("   (Did you finish video.model.js? The seed needs its validators.)");
  process.exit(1);
}
