import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import devRoutes from "./routes/dev.js";
import adminRoutes from "./routes/admin.js";
import IpAllowList from "./models/IpAllowList.js";

const app = express();
const PORT = process.env.PORT || 4000;
app.set("trust proxy", 1);

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  Boolean
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, { dbName: "taskmanager" })
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    const count = await IpAllowList.countDocuments();
    if (count === 0) {
      const ips = (process.env.ALLOW_IPS || "127.0.0.1,::1")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await IpAllowList.insertMany(ips.map((ip) => ({ ip, isActive: true })));

      console.log("[allowlist] seeded:", ips.join(", "));
    } else {
      console.log("[allowlist] already seeded, skipping.");
    }

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Connection failed:", err.message));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dev", devRoutes);
app.use("/api/admin", adminRoutes);
