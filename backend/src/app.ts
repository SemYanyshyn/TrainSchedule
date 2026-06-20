import cors from "cors";
import express from "express";

import authRoutes from "./routes/auth.routes";
import trainRoutes from "./routes/train.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trains", trainRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
