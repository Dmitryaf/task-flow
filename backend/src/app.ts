import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

export default app;
