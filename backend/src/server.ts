import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { DEFAULT_PORT } from "./config/server";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
