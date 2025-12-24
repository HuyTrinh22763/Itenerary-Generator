import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import authRoutes from "./routes/auth";
import itineraryRoutes from "./routes/itineraries";
import billingRoutes from "./routes/billing";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use("/billing/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/auth", authRoutes);
app.use("/itineraries", itineraryRoutes);
app.use("/billing", billingRoutes);
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
);

const PORT = Number(config.port) || 4000;
app.listen(PORT, "0.0.0.0", () => {
  // 0.0.0.0 accepts connection from anywhere
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
