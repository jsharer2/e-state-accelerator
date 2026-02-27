import express from "express";
import cors from "cors";
import scanRoutes from "./routes/scanRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Scan routes
app.use("/api/scan", scanRoutes);

// Start server and keep a reference
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

// Graceful shutdown (important for tsx watch / nodemon)
const shutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down...`);
  server.close((err) => {
    if (err) {
      console.error("Error closing server:", err);
      process.exit(1);
    }
    process.exit(0);
  });

  // Failsafe: force exit if something hangs
  setTimeout(() => process.exit(1), 5000).unref();
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));