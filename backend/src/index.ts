import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoutes from "./routes/scanRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./db/connection.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/scan", scanRoutes);

// Start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });

    const shutdown = (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down...`);
      server.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          process.exit(1);
        }
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 5000).unref();
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });